import { TeacherAlertMode } from '@app/teacher/domain/enums/teacher-alert.type';

export type FindNearbyAddressCandidatesQuery = Readonly<{
  lat: number;
  lng: number;
  radiusKm: number;
}>;

export type NearByAddressPrefRecod = Readonly<{
  teacherId: string;
  lat: number;
  lng: number;
  radiusKm: number;
}>;

export type FindRegionTeachersQuery =
  | Readonly<{ level: 'SIGUNGU'; sigunguCode: string }>
  | Readonly<{ level: 'SIDO'; sidoCode: string }>;

export type RegionTeacherRecord = Readonly<{ teacherId: string }>;

export type FindStationsWithinQuery = Readonly<{
  lat: number;
  lng: number;
  radiusKm: number;
}>;
export type StationWithinRecord = Readonly<{
  id: string;
  lat: number;
  lng: number;
}>;

export type FindTeachersByStationIdsQuery = Readonly<{ stationIds: string[] }>;
export type TeacherStationPrefRcord = Readonly<{
  teacherId: string;
  stationId: string;
  radiusKm: number;
}>;

export type FindTeachersByIdsQuery = Readonly<{ ids: string[] }>;
export type TeacherContactRecord = Readonly<{
  id: string;
  name: string;
  phone: string;
}>;

export type FindTeacherAlertSettingsQuery = Readonly<{ teacherIds: string[] }>;
export type TeacherAlertSettingRecord = Readonly<{
  teacherId: string;
  mode: TeacherAlertMode;
}>;
