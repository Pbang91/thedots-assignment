import { PushPayload } from './push.port.type';

export interface PushPort {
  sendJobPostCreated(teacherIds: string[], payload: PushPayload): Promise<void>;
}
