export const TEACHER_DEVICE_TOKEN_PLATFORM = {
  IOS: 'IOS',
  ANDROID: 'ANDROID',
  WEB: 'WEB'
} as const;

export type TeacherDeviceTokenPlatform = (typeof TEACHER_DEVICE_TOKEN_PLATFORM)[keyof typeof TEACHER_DEVICE_TOKEN_PLATFORM];