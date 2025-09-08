import { TeacherQueryPort } from '@app/teacher/application/port/teacher-query.port';
import { FcmPushAdapter } from './push.fcm.adapter';
import { TEACHER_DEVICE_TOKEN_PLATFORM } from '@app/teacher/domain/enums/teacher-device-token.type';

describe('FcmPushAdapter', () => {
  let adapter: FcmPushAdapter;
  let teacherPort: jest.Mocked<TeacherQueryPort>;

  beforeEach(() => {
    teacherPort = {
      getActiveDeviceTokens: jest.fn(),
    } as any;

    adapter = new FcmPushAdapter(teacherPort);
  });

  it('teacherIds로 활성 토큰 조회를 호출한다', async () => {
    teacherPort.getActiveDeviceTokens.mockResolvedValueOnce([
      {
        teacherId: 't1',
        token: 'isToken1',
        platform: TEACHER_DEVICE_TOKEN_PLATFORM.ANDROID,
      },
      {
        teacherId: 't2',
        token: 'isToken2',
        platform: TEACHER_DEVICE_TOKEN_PLATFORM.IOS,
      },
    ]);

    await adapter.sendJobPostCreated(['t1', 't2'], {
      title: '공고 보세요',
      body: '공고에요',
      data: { postId: 'post1' },
    });

    expect(teacherPort.getActiveDeviceTokens).toHaveBeenCalledTimes(1);
    expect(teacherPort.getActiveDeviceTokens).toHaveBeenCalledWith({
      teacherIds: ['t1', 't2'],
    });
  });

  it('토큰 없을 때도 정상 종료', async () => {
    teacherPort.getActiveDeviceTokens.mockResolvedValueOnce([]);

    await expect(
      adapter.sendJobPostCreated(['t1'], { title: 't', body: 'b' }),
    ).resolves.toBeUndefined();

    expect(teacherPort.getActiveDeviceTokens).toHaveBeenCalledWith({
      teacherIds: ['t1'],
    });
  });
});
