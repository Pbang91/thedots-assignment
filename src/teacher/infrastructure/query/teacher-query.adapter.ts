import { SubwayStation } from '@app/reference/domain/entities/subway-station.entity';
import { bboxAround } from '@app/shared/utils/geo.util';
import { TeacherQueryPort } from '@app/teacher/application/query/port/teacher-query.port';
import {
  FindNearbyAddressCandidatesQuery,
  NearByAddressPrefRecod,
  FindRegionTeachersQuery,
  RegionTeacherRecord,
  FindStationsWithinQuery,
  StationWithinRecord,
  FindTeachersByStationIdsQuery,
  TeacherStationPrefRcord,
  FindTeachersByIdsQuery,
  TeacherContactRecord,
} from '@app/teacher/application/query/port/teacher-query.port.type';
import { TeacherNearbyAddressPref } from '@app/teacher/domain/entities/teacher-nearby-address-pref.entity';
import { TeacherRegionPref } from '@app/teacher/domain/entities/teacher-region-preff.entity';
import { TeacherStationPref } from '@app/teacher/domain/entities/teacher-station-pref.entity';
import { Teacher } from '@app/teacher/domain/entities/teacher.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, FindOptionsWhere, In } from 'typeorm';

@Injectable()
export class TeacherQueryAdapter implements TeacherQueryPort {
  constructor(
    @InjectRepository(Teacher)
    private readonly teacherRepo: Repository<Teacher>,

    @InjectRepository(TeacherNearbyAddressPref)
    private readonly nearbyPrefRepo: Repository<TeacherNearbyAddressPref>,

    @InjectRepository(TeacherRegionPref)
    private readonly regionPrefRepo: Repository<TeacherRegionPref>,

    @InjectRepository(TeacherStationPref)
    private readonly stationPrefRepo: Repository<TeacherStationPref>,

    @InjectRepository(SubwayStation)
    private readonly subwayRepo: Repository<SubwayStation>,
  ) {}

  public async findNearbyAddressCandidates(
    q: FindNearbyAddressCandidatesQuery,
  ): Promise<NearByAddressPrefRecod[]> {
    const { lat, lng, radiusKm } = q;
    const { minLat, maxLat, minLng, maxLng } = bboxAround(lat, lng, radiusKm);

    const rows = await this.nearbyPrefRepo.findBy({
      lat: Between(minLat, maxLat),
      lng: Between(minLng, maxLng),
    });

    return rows.map((r) => ({
      teacherId: r.teacherId,
      lat: r.lat,
      lng: r.lng,
      radiusKm: r.radiusKm,
    }));
  }

  public async findRegionTeachers(
    q: FindRegionTeachersQuery,
  ): Promise<RegionTeacherRecord[]> {
    const level = q.level;
    const code = level == 'SIDO' ? q.sidoCode : q.sigunguCode;
    const where: FindOptionsWhere<TeacherRegionPref> = {
      regionLevel: level,
    };

    if (level === 'SIDO') {
      where.sidoCode = code;
    } else {
      where.sigunguCode = code;
    }

    const rows = await this.regionPrefRepo.find({
      select: { teacherId: true },
      where,
    });

    return rows.map((r) => ({ ...r }));
  }

  /**
   * 반경 내 지하철역(1차 후보)
   * @param q - 위,경도, 1차 반경
   */
  public async findStationsWithin(
    q: FindStationsWithinQuery,
  ): Promise<StationWithinRecord[]> {
    const { lat, lng, radiusKm } = q;
    const { minLat, maxLat, minLng, maxLng } = bboxAround(lat, lng, radiusKm);

    const rows = await this.subwayRepo.findBy({
      lat: Between(minLat, maxLat),
      lng: Between(minLng, maxLng),
    });

    return rows.map((r) => ({ id: r.id, lat: r.lat, lng: r.lng }));
  }

  /**
   * 역 Ids를 통해 매핑 데이터 조회
   * @param q - 역 ids
   */
  public async findTeachersByStationIds(
    q: FindTeachersByStationIdsQuery,
  ): Promise<TeacherStationPrefRcord[]> {
    const { stationIds } = q;

    if (!stationIds.length) return [];

    const rows = await this.stationPrefRepo.find({
      where: { subwayStationId: In(stationIds) },
    });

    return rows.map((r) => ({
      teacherId: r.teacherId,
      stationId: r.subwayStationId,
      radiusKm: r.radiusKm,
    }));
  }
  public async getContactsByIds(
    q: FindTeachersByIdsQuery,
  ): Promise<TeacherContactRecord[]> {
    const { ids } = q;

    if (!ids.length) return [];

    const rows = await this.teacherRepo.find({
      select: { id: true, name: true, phone: true },
      where: { id: In(ids), isActive: true },
    });

    return rows.map((r) => ({ id: r.id, name: r.name, phone: r.phone }));
  }
}
