import { SubwayStation } from '@app/reference/domain/entities/subway-station.entity';
import { TeacherNearbyAddressPref } from '@app/teacher/domain/entities/teacher-nearby-address-pref.entity';
import { TeacherRegionPref } from '@app/teacher/domain/entities/teacher-region-preff.entity';
import { TeacherStationPref } from '@app/teacher/domain/entities/teacher-station-pref.entity';
import { Teacher } from '@app/teacher/domain/entities/teacher.entity';
import { FindOperator, In } from 'typeorm';
import { Repository } from 'typeorm/repository/Repository';
import { TeacherQueryAdapter } from './teacher-query.adapter';
import { bboxAround } from '@app/shared/utils/geo.util';
import { TeacherAlertSetting } from '@app/teacher/domain/entities/teacher-alert-setting.entity';
import { TEACHER_ALERT_MODE } from '@app/teacher/domain/enums/teacher-alert.type';
import { TeacherDeviceToken } from '@app/teacher/domain/entities/teacher-device-token.entity';

function mockRepo<T>() {
  return {
    findBy: jest.fn(),
    find: jest.fn(),
  } as unknown as jest.Mocked<Repository<T>>;
}

describe('TeacherQueryAdapter', () => {
  let adapter: TeacherQueryAdapter;
  let teacherRepo: jest.Mocked<Repository<Teacher>>;
  let nearbyPrefRepo: jest.Mocked<Repository<TeacherNearbyAddressPref>>;
  let regionPrefRepo: jest.Mocked<Repository<TeacherRegionPref>>;
  let stationPrefRepo: jest.Mocked<Repository<TeacherStationPref>>;
  let subwayRepo: jest.Mocked<Repository<SubwayStation>>;
  let alertRepo: jest.Mocked<Repository<TeacherAlertSetting>>;
  let deviceTokenRepo: jest.Mocked<Repository<TeacherDeviceToken>>;

  beforeEach(() => {
    teacherRepo = mockRepo<Teacher>();
    nearbyPrefRepo = mockRepo<TeacherNearbyAddressPref>();
    regionPrefRepo = mockRepo<TeacherRegionPref>();
    stationPrefRepo = mockRepo<TeacherStationPref>();
    subwayRepo = mockRepo<SubwayStation>();
    alertRepo = mockRepo<TeacherAlertSetting>();
    deviceTokenRepo = mockRepo<TeacherDeviceToken>();

    adapter = new TeacherQueryAdapter(
      teacherRepo,
      nearbyPrefRepo,
      regionPrefRepo,
      stationPrefRepo,
      subwayRepo,
      alertRepo,
      deviceTokenRepo
    );
  });

  it('findNearByAddressCandidates: findBy 호출 후 매핑', async () => {
    const rows = [
      { teacherId: '김째깍', lat: 37.5, lng: 127.0, radiusKm: 5 } as any,
    ];
    nearbyPrefRepo.findBy.mockResolvedValueOnce(rows);

    const reqLat = 37.5;
    const reqLng = 127.02;
    const reqRadius = 7;

    const res = await adapter.findNearbyAddressCandidates({
      lat: reqLat,
      lng: reqLng,
      radiusKm: reqRadius,
    });

    expect(nearbyPrefRepo.findBy).toHaveBeenCalledTimes(1);

    // Between 들어갔는지 확인
    const where = (nearbyPrefRepo.findBy as jest.Mock).mock.calls[0][0];

    expect(where.lat).toBeInstanceOf(FindOperator);
    expect((where.lat as any).type).toBe('between');

    const { minLat, maxLat, minLng, maxLng } = bboxAround(
      reqLat,
      reqLng,
      reqRadius,
    );
    expect((where.lat as any).value).toEqual([minLat, maxLat]);
    expect((where.lng as any).value).toEqual([minLng, maxLng]);

    expect(res).toEqual(rows);
  });

  it('findRegionTeachers: SIDO/SIGUNGU 분기', async () => {
    regionPrefRepo.find.mockResolvedValueOnce([{ teacherId: 't2' } as any]);

    // SIDO
    const sido = await adapter.findRegionTeachers({
      level: 'SIDO',
      sidoCode: '11',
    } as any);

    expect(regionPrefRepo.find).toHaveBeenCalledTimes(1);
    expect(sido).toEqual([{ teacherId: 't2' }]);

    (regionPrefRepo.find as jest.Mock).mockClear();

    // SIGUNGU
    regionPrefRepo.find.mockResolvedValueOnce([{ teacherId: 't3' } as any]);
    const sigungu = await adapter.findRegionTeachers({
      level: 'SIGUNGU',
      sigunguCode: '11110',
    } as any);

    expect(regionPrefRepo.find).toHaveBeenCalledTimes(1);
    expect(sigungu).toEqual([{ teacherId: 't3' }]);
  });

  it('findStationsWithin: 역 후보 조회', async () => {
    subwayRepo.findBy.mockResolvedValueOnce([
      { id: 's1', lat: 37.51, lng: 127.01 } as any,
    ]);
    const res = await adapter.findStationsWithin({
      lat: 37.5,
      lng: 127.0,
      radiusKm: 1.2,
    });

    expect(subwayRepo.findBy).toHaveBeenCalledTimes(1);
    expect(res).toEqual([{ id: 's1', lat: 37.51, lng: 127.01 }]);
  });

  it('findTeachersByStationIds: 빈 배열이면 바로 []', async () => {
    const res = await adapter.findTeachersByStationIds({ stationIds: [] });
    expect(res).toEqual([]);
    expect(stationPrefRepo.find).not.toHaveBeenCalled();
  });

  it('findTeachersByStationIds: 매핑 확인', async () => {
    stationPrefRepo.find.mockResolvedValueOnce([
      { teacherId: 't1', subwayStationId: 's1', radiusKm: 1 } as any,
    ]);
    const res = await adapter.findTeachersByStationIds({ stationIds: ['s1'] });

    expect(stationPrefRepo.find).toHaveBeenCalledWith({
      where: { subwayStationId: In(['s1']) },
    });

    expect(res).toEqual([{ teacherId: 't1', stationId: 's1', radiusKm: 1 }]);
  });

  it('getContactsByIds: ids 없으면 []', async () => {
    const res = await adapter.getContactsByIds({ ids: [] });
    expect(res).toEqual([]);
    expect(teacherRepo.find).not.toHaveBeenCalled();
  });

  it('getContactsByIds: 연락처 매핑', async () => {
    teacherRepo.find.mockResolvedValueOnce([
      { id: 't1', name: '김째깍', phone: '01012345678', isActive: true } as any,
    ]);

    const res = await adapter.getContactsByIds({ ids: ['t1'] });
    expect(teacherRepo.find).toHaveBeenCalled();
    expect(res).toEqual([{ id: 't1', name: '김째깍', phone: '01012345678' }]);
  });

  it('getAlertSettings: id가 없으면 []', async () => {
    const res = await adapter.getAlertSettings({ teacherIds: [] } as any);

    expect(res).toEqual([]);
  });

  it('getAlertSettings: In 조회', async () => {
    alertRepo.find.mockResolvedValueOnce([
      { teacherId: 't1', mode: TEACHER_ALERT_MODE.NEARBY } as any,
    ]);

    const res = await adapter.getAlertSettings({ teacherIds: ['t1'] } as any);

    expect(alertRepo.find).toHaveBeenCalled();
    expect(res).toEqual([{ teacherId: 't1', mode: TEACHER_ALERT_MODE.NEARBY }]);
  });
});
