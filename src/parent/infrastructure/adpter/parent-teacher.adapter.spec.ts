import { GeocodingPort } from '@app/parent/application/port/geocoding.port';
import { TeacherQueryPort } from '@app/teacher/application/port/teacher-query.port';
import { ParentTeacherAdapter } from './parent-teacher.adapter';
import { TEACHER_ALERT_MODE } from '@app/teacher/domain/enums/teacher-alert.type';

describe('ParentTeacherAdapter', () => {
  const teacherPort: jest.Mocked<TeacherQueryPort> = {
    findNearbyAddressCandidates: jest.fn(),
    findRegionTeachers: jest.fn(),
    findStationsWithin: jest.fn(),
    findTeachersByStationIds: jest.fn(),
    getContactsByIds: jest.fn(),
    getAlertSettings: jest.fn(),
  } as any;

  const geocoding: jest.Mocked<GeocodingPort> = {
    reverse: jest.fn(),
  };

  let adapter: ParentTeacherAdapter;

  beforeEach(() => {
    jest.resetAllMocks();
    adapter = new ParentTeacherAdapter(teacherPort, geocoding);
  });

  it('매칭이 전혀 없으면 []', async () => {
    teacherPort.findNearbyAddressCandidates.mockResolvedValueOnce([]);
    geocoding.reverse.mockResolvedValueOnce({}); // sido/sigungu 없음
    teacherPort.findStationsWithin.mockResolvedValueOnce([]);
    teacherPort.findTeachersByStationIds.mockResolvedValueOnce([]);
    teacherPort.getContactsByIds.mockResolvedValueOnce([]);

    const out = await adapter.recommendTeacherByLocation({
      lat: 37.5,
      lng: 127.0,
    });
    expect(out).toEqual([]);
  });

  it('세 경로(인근/지역/역) 합집합 후 연락처 반환', async () => {
    /**
     * t1 - 거리 0.5km
     * t2 - 거리 2km(제외)
     */

    teacherPort.findNearbyAddressCandidates.mockResolvedValueOnce([
      { teacherId: 't1', lat: 37.5, lng: 127.0, radiusKm: 1 },
      { teacherId: 't2', lat: 37.52, lng: 127.0, radiusKm: 1 },
    ] as any);

    // 2) 지역: t3
    geocoding.reverse.mockResolvedValueOnce({ sidoCode: '11' } as any);
    teacherPort.findRegionTeachers.mockResolvedValueOnce([{ teacherId: 't3' }]);

    // 3) 역: s1 근처, t4는 반경 1km
    teacherPort.findStationsWithin.mockResolvedValueOnce([
      { id: 's1', lat: 37.501, lng: 127.001 } as any,
    ]);

    teacherPort.findTeachersByStationIds.mockResolvedValueOnce([
      { teacherId: 't4', stationId: 's1', radiusKm: 1 },
    ]);

    teacherPort.getAlertSettings.mockResolvedValue([
      { teacherId: 't1', mode: TEACHER_ALERT_MODE.NEARBY }, // 인근만 허용
      { teacherId: 't2', mode: TEACHER_ALERT_MODE.NEARBY }, // 멀어서 어차피 후보에서 제외
      { teacherId: 't3', mode: TEACHER_ALERT_MODE.REGION }, // 지역만 허용
      { teacherId: 't4', mode: TEACHER_ALERT_MODE.STATION }, // 역만 허용
    ]);

    teacherPort.getContactsByIds.mockResolvedValueOnce([
      { id: 't1', name: 'A', phone: '01012345678' },
      { id: 't3', name: 'B', phone: '01012345679' },
      { id: 't4', name: 'C', phone: '01012345677' },
    ]);

    const res = await adapter.recommendTeacherByLocation({
      lat: 37.5,
      lng: 127.0,
    });

    // 후보로 잡힌 모든 id에 대해 알림 모드를 조회했는지 확인
    const calledIds = (teacherPort.getAlertSettings as jest.Mock).mock
      .calls[0][0].teacherIds;

    expect(new Set(calledIds)).toEqual(new Set(['t1', 't3', 't4']));

    expect(teacherPort.getContactsByIds).toHaveBeenCalledTimes(1);
    expect(
      new Set((teacherPort.getContactsByIds as jest.Mock).mock.calls[0][0].ids),
    ).toEqual(new Set(['t1', 't3', 't4']));

    // t1, t3, t4만 포함(가까움/지역/역반경)
    expect(res).toEqual([
      { id: 't1', name: 'A', phone: '01012345678' },
      { id: 't3', name: 'B', phone: '01012345679' },
      { id: 't4', name: 'C', phone: '01012345677' },
    ]);
  });
});
