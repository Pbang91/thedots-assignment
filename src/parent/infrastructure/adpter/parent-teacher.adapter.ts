import { Inject, Injectable } from '@nestjs/common';
import { GEOCODING_PORT } from '@app/parent/application/query/port/gecording.port.token';
import { GeocodingPort } from '@app/parent/application/query/port/geocoding.port';
import { ParentTeacherPort } from '@app/parent/application/query/port/parant-teacher.port';
import {
  RecommendByLocationQuery,
  TeacherContactView,
} from '@app/parent/application/query/port/parent-teacher.port.type';
import { haversineKm } from '@app/shared/utils/geo.util';
import { TeacherQueryPort } from '@app/teacher/application/query/port/teacher-query.port';
import { TEACHER_QUERY_PORT } from '@app/teacher/application/query/port/teacher-query.port.token';
import { TEACHER_ALERT_MODE } from '@app/teacher/domain/enums/teacher-alert.type';

@Injectable()
export class ParentTeacherAdapter implements ParentTeacherPort {
  constructor(
    @Inject(TEACHER_QUERY_PORT) private readonly teacherPort: TeacherQueryPort,
    @Inject(GEOCODING_PORT) private readonly geocoding: GeocodingPort,
  ) {}

  public async recommend(
    q: RecommendByLocationQuery,
  ): Promise<TeacherContactView[]> {
    const { lat, lng, address, zipcode } = q;

    // 인근 5km 반경(1차 필터 -> 2차 정밀)
    const nearby = await this.teacherPort.findNearbyAddressCandidates({
      lat,
      lng,
      radiusKm: 7,
    });

    const nearbyTeacherIds = nearby
      .filter((p) => haversineKm(lat, lng, p.lat, p.lng) <= p.radiusKm)
      .map((p) => p.teacherId);

    // 지역 내
    const { sidoCode, sigunguCode } = await this.geocoding.reverse({
      lat,
      lng,
      address,
      zipcode,
    });

    let regions: { teacherId: string }[] = [];

    if (sigunguCode) {
      regions = await this.teacherPort.findRegionTeachers({
        level: 'SIGUNGU',
        sigunguCode: sigunguCode,
      });
    } else if (sidoCode) {
      regions = await this.teacherPort.findRegionTeachers({
        level: 'SIDO',
        sidoCode: sidoCode,
      });
    }

    const regionTeacherIds = regions.map((r) => r.teacherId);

    // 지하철역 1km 반경(1차 필터 -> 2차 정밀)
    const stations = await this.teacherPort.findStationsWithin({
      lat,
      lng,
      radiusKm: 1.2,
    });

    const teachersAroundStation =
      await this.teacherPort.findTeachersByStationIds({
        stationIds: stations.map((s) => s.id),
      });

    const stationTeacherIds = teachersAroundStation
      .filter((p) => {
        const st = stations.find((s) => s.id == p.stationId);

        return st ? haversineKm(lat, lng, st.lat, st.lng) <= p.radiusKm : false;
      })
      .map((p) => p.teacherId);

    const candidateIds = Array.from(
      new Set([...nearbyTeacherIds, ...regionTeacherIds, ...stationTeacherIds]),
    );

    if (!candidateIds.length) return [];

    // NOTE: 데이터양과 응답시간을 추적하여 추후 query level(join)로 변경 가능
    // 알림을 원하는 선생님의 정보만을 전달
    const settings = await this.teacherPort.getAlertSettings({
      teacherIds: candidateIds,
    });

    const modeMap = new Map((settings ?? []).map((s) => [s.teacherId, s.mode]));

    const uniqueIds = new Set<string>([
      ...nearbyTeacherIds.filter(
        (id) => modeMap.get(id) === TEACHER_ALERT_MODE.NEARBY,
      ),
      ...regionTeacherIds.filter(
        (id) => modeMap.get(id) === TEACHER_ALERT_MODE.REGION,
      ),
      ...stationTeacherIds.filter(
        (id) => modeMap.get(id) === TEACHER_ALERT_MODE.STATION,
      ),
    ]);

    if (!uniqueIds.size) return [];

    const contacts = await this.teacherPort.getContactsByIds({
      ids: [...uniqueIds],
    });

    return contacts.map((c) => ({ name: c.name, phone: c.phone }));
  }
}
