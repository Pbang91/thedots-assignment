import { Inject, Injectable } from '@nestjs/common';
import { ParentTeacherPort } from '../port/parant-teacher.port';
import { CreateJobPostReqDto } from '../dto/create-job-post.req.dto';
import { RecommendedTeacherResDto } from '../dto/recommended-teacher.res.dto';
import { PARENT_TEACHER_PORT } from '../port/parent-teacher.port.token';

@Injectable()
export class CreateJobPostHandler {
  constructor(
    @Inject(PARENT_TEACHER_PORT)
    private readonly parentTeacherPort: ParentTeacherPort,
  ) {}

  public async execute(
    dto: CreateJobPostReqDto,
  ): Promise<RecommendedTeacherResDto[]> {
    const teachers = await this.parentTeacherPort.recommend({
      lat: dto.lat,
      lng: dto.lng,
      address: dto.address,
      zipcode: dto.zipcode,
    });

    return teachers.map(
      (teacher) => new RecommendedTeacherResDto(teacher.name, teacher.phone),
    );
  }
}
