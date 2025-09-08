import { PushPort } from "@app/parent/application/port/push.port";
import { PushPayload } from "@app/parent/application/port/push.port.type";
import { TeacherQueryPort } from "@app/teacher/application/port/teacher-query.port";
import { TEACHER_QUERY_PORT } from "@app/teacher/application/port/teacher-query.port.token";
import { Inject, Injectable } from "@nestjs/common";

@Injectable()
export class FcmPushAdapter implements PushPort {
  constructor(@Inject(TEACHER_QUERY_PORT) private readonly teacherPort: TeacherQueryPort) {}

  public async sendJobPostCreated(teacherIds: string[], payload: PushPayload): Promise<void> {
    const tokenInfoList = await this.teacherPort.getActiveDeviceTokens({teacherIds});

    if (tokenInfoList.length) {
      // fcm으로 알림 진행
    }
  }
}