import { JobPostAddress } from "@app/parent/domain/entities/job-post-address.entity";
import { JobPost } from "@app/parent/domain/entities/job-post.entity";
import { Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateJobPostData} from "./job-post-command.type";
import { PARENT_TEACHER_PORT } from "../../port/parent-teacher.port.token";
import { ParentTeacherPort } from "../../port/parant-teacher.port";
import { PUSH_PORT } from "../../port/push.port.token";
import { PushPort } from "../../port/push.port";
import { CreateJobPostResDto } from "@app/parent/presentation/command/dto/create-job-post.res.dto";

@Injectable()
export class JobPostCommandService {
  constructor(
    @InjectRepository(JobPost)
    private readonly postRepo: Repository<JobPost>,
    
    @InjectRepository(JobPostAddress)
    private readonly postAddrRepo: Repository<JobPostAddress>,

    @Inject(PARENT_TEACHER_PORT) private readonly matcher: ParentTeacherPort,
    @Inject(PUSH_PORT) private readonly pushPort: PushPort
  ) {}

  public async createJobPost(dto: CreateJobPostData): Promise<CreateJobPostResDto> {
    const {addrDetail, sigungu, sido, zipcode, parentId, detail, lat, lng} = dto;
    
    const addr = JobPostAddress.create({
      addrDetail,
      sigungu,
      sido,
      zipcode
    });

    const savedAddr = await this.postAddrRepo.save(addr);

    const post = JobPost.create({
      parentId,
      jobPostAddressId: savedAddr.id,
      detail
    });

    const savedPost = await this.postRepo.save(post);

    const teachers = await this.matcher.recommendTeacherByLocation({
      lat,
      lng,
      address: addrDetail,
      zipcode
    });

    const teacherIds = teachers.map(t => t.id);
    
    await this.pushPort.sendJobPostCreated(teacherIds, {title: '새 공고가 등록되었습니다', body: `${sido} ${sigungu} 근처 공고를 확인해보세요`, data: {postId: savedPost.id}});

    return new CreateJobPostResDto(savedPost.id);
  }
}