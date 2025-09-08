import {
  FindNearbyAddressCandidatesQuery,
  FindRegionTeachersQuery,
  FindStationsWithinQuery,
  FindTeacherAlertSettingsQuery,
  FindTeacherDeviceTokensQuery,
  FindTeachersByIdsQuery,
  FindTeachersByStationIdsQuery,
  NearByAddressPrefRecod,
  RegionTeacherRecord,
  StationWithinRecord,
  TeacherAlertSettingRecord,
  TeacherContactRecord,
  TeacherDeviceTokenRecord,
  TeacherStationPrefRcord,
} from './teacher-query.port.type';

export interface TeacherQueryPort {
  findNearbyAddressCandidates(
    q: FindNearbyAddressCandidatesQuery,
  ): Promise<NearByAddressPrefRecod[]>;

  findRegionTeachers(
    q: FindRegionTeachersQuery,
  ): Promise<RegionTeacherRecord[]>;

  findStationsWithin(
    q: FindStationsWithinQuery,
  ): Promise<StationWithinRecord[]>;

  findTeachersByStationIds(
    q: FindTeachersByStationIdsQuery,
  ): Promise<TeacherStationPrefRcord[]>;

  getContactsByIds(q: FindTeachersByIdsQuery): Promise<TeacherContactRecord[]>;

  getAlertSettings(
    q: FindTeacherAlertSettingsQuery,
  ): Promise<TeacherAlertSettingRecord[]>;

  getActiveDeviceTokens(q: FindTeacherDeviceTokensQuery): Promise<TeacherDeviceTokenRecord[]>;
}
