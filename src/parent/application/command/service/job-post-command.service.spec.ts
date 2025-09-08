import { JobPostAddress } from "@app/parent/domain/entities/job-post-address.entity";
import { JobPost } from "@app/parent/domain/entities/job-post.entity";
import { Repository } from "typeorm";
import { ParentTeacherPort } from "../../port/parant-teacher.port";
import { PushPort } from "../../port/push.port";
import { JobPostCommandService } from "./job-post-command.service";
import { CreateJobPostResDto } from "@app/parent/presentation/command/dto/create-job-post.res.dto";

function mockRepo<T>() {
  return { save: jest.fn() } as unknown as jest.Mocked<Repository<T>>;
}

describe('JobPostCommandService', () => {
  let matcher: jest.Mocked<ParentTeacherPort> = {
    recommendTeacherByLocation: jest.fn()
  };
  let pushPort: jest.Mocked<PushPort> = {
    sendJobPostCreated: jest.fn()
  };
  
  let postRepo: jest.Mocked<Repository<JobPost>>;
  let addrRepo: jest.Mocked<Repository<JobPostAddress>>;
  let service: JobPostCommandService;

  beforeEach(() => {
    jest.resetAllMocks();
    
    postRepo = mockRepo<JobPost>();
    addrRepo = mockRepo<JobPostAddress>();
    service = new JobPostCommandService(
      postRepo,
      addrRepo,
      matcher,
      pushPort,
    );

    pushPort.sendJobPostCreated.mockResolvedValue(undefined);
  });

  it('공고 저장 후 추천 -> 푸시 호출 -> id 반환', async () => {
    addrRepo.save.mockResolvedValueOnce({ id: 'addr1' } as any);
    postRepo.save.mockResolvedValueOnce({ id: 'post1' } as any);

    matcher.recommendTeacherByLocation.mockResolvedValueOnce([
      { id: 't1', name: 'A', phone: '01012345678' },
      { id: 't2', name: 'B', phone: '01012345679' },
    ]);

    const dto = {
      parentId: 'p1',
      detail: '디테일한 공고 내용',
      addrDetail: '서울 강남구',
      sigungu: '강남구',
      sido: '서울특별시',
      zipcode: '06236',
      lat: 37.5,
      lng: 127.0,
    };

    const out = await service.createJobPost(dto);

    // 저장 확인
    expect(addrRepo.save).toHaveBeenCalledTimes(1);
    expect(postRepo.save).toHaveBeenCalledTimes(1);

    // 추천 호출 파라미터 확인
    expect(matcher.recommendTeacherByLocation).toHaveBeenCalledWith({
      lat: 37.5,
      lng: 127.0,
      address: '서울 강남구',
      zipcode: '06236',
    });

    // 푸시 호출 파라미터 확인
    expect(pushPort.sendJobPostCreated).toHaveBeenCalledTimes(1);
    expect(pushPort.sendJobPostCreated).toHaveBeenCalledWith(
      ['t1', 't2'],
      {
        title: '새 공고가 등록되었습니다',
        body: '서울특별시 강남구 근처 공고를 확인해보세요',
        data: { postId: 'post1' },
      },
    );

    // 응답 확인
    expect(out).toEqual(new CreateJobPostResDto('post1'));
  });

  it('추천 결과가 비어도 에러 없이 푸시(빈 배열) 호출', async () => {
    addrRepo.save.mockResolvedValueOnce({ id: 'addr1' } as any);
    postRepo.save.mockResolvedValueOnce({ id: 'post1' } as any);
    matcher.recommendTeacherByLocation.mockResolvedValueOnce([]);

    const out = await service.createJobPost({
      parentId: 'p1',
      addrDetail: '서울 강남구',
      sigungu: '강남구',
      sido: '서울특별시',
      zipcode: '06236',
      lat: 37.5,
      lng: 127.0,
    });

    expect(pushPort.sendJobPostCreated).toHaveBeenCalledWith(
      [],
      expect.any(Object),
    );
    expect(out).toEqual(new CreateJobPostResDto('post1'));
  });
});