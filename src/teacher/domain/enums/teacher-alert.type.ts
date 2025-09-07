export const TEACHER_ALERT_MODE = {
  NEARBY: 'NEARBY',
  REGION: 'REGION',
  STATION: 'STATION',
} as const;

export type TeacherAlertMode =
  (typeof TEACHER_ALERT_MODE)[keyof typeof TEACHER_ALERT_MODE];
