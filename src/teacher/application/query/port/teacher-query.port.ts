import {
  FindNearByAddressCandidatesQuery,
  FindRegionTeachersQuery,
  FindStationsWithinQuery,
  FindTeachersByIdsQuery,
  FindTeachersByStationIdsQuery,
  NearByAddressPrefRecod,
  RegionTeacherRecord,
  StationWithinRecord,
  TeacherContactRecord,
  TeacherStationPrefRcord,
} from './teacher-query.port.type';

export interface TeacherQueryPort {
  findNearByAddressCandidates(
    q: FindNearByAddressCandidatesQuery,
  ): Promise<NearByAddressPrefRecod[]>;

  findRegionTeachers(
    q: FindRegionTeachersQuery,
  ): Promise<RegionTeacherRecord[]>;

  findStationsWithIn(
    q: FindStationsWithinQuery,
  ): Promise<StationWithinRecord[]>;

  findTeachersByStationsIds(
    q: FindTeachersByStationIdsQuery,
  ): Promise<TeacherStationPrefRcord[]>;

  getContactsByIds(q: FindTeachersByIdsQuery): Promise<TeacherContactRecord[]>;
}
