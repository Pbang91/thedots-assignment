import { GeocodingPort } from '@app/parent/application/query/port/geocoding.port';
import { TeacherQueryPort } from '@app/teacher/application/query/port/teacher-query.port';
import { ParentTeacherAdapter } from './parent-teacher.adapter';

describe('ParentTeacherAdapter', () => {
  const teacherPort: jest.Mocked<TeacherQueryPort> = {
    findNearbyAddressCandidates: jest.fn(),
    findRegionTeachers: jest.fn(),
    findStationsWithin: jest.fn(),
    findTeachersByStationIds: jest.fn(),
    getContactsByIds: jest.fn(),
  } as any;

  const geocoding: jest.Mocked<GeocodingPort> = {
    reverse: jest.fn(),
  };

  let adapter: ParentTeacherAdapter;

  beforeEach(() => {
    jest.clearAllMocks();
    adapter = new ParentTeacherAdapter(teacherPort, geocoding);
  });

  it('매칭이 전혀 없으면 []', async () => {
    teacherPort.findNearbyAddressCandidates.mockResolvedValueOnce([]);
    geocoding.reverse.mockResolvedValueOnce({}); // sido/sigungu 없음
    teacherPort.findStationsWithin.mockResolvedValueOnce([]);
    teacherPort.findTeachersByStationIds.mockResolvedValueOnce([]);
    teacherPort.getContactsByIds.mockResolvedValueOnce([]);

    const out = await adapter.recommend({ lat: 37.5, lng: 127.0 });
    expect(out).toEqual([]);
    expect(teacherPort.getContactsByIds).toHaveBeenCalledWith({ ids: [] });
  });

  it('세 경로(인근/지역/역) 합집합 후 연락처 반환', async () => {
    /**
     * t1 - 거리 0.5km
     * t2 - 거리 2km
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

    teacherPort.getContactsByIds.mockResolvedValueOnce([
      { id: 't1', name: 'A', phone: '0101' },
      { id: 't3', name: 'B', phone: '0103' },
      { id: 't4', name: 'C', phone: '0104' },
    ]);

    const out = await adapter.recommend({ lat: 37.5, lng: 127.0 });

    // t1, t3, t4만 포함(가까움/지역/역반경)
    expect(out).toEqual([
      { name: 'A', phone: '0101' },
      { name: 'B', phone: '0103' },
      { name: 'C', phone: '0104' },
    ]);
  });
});
