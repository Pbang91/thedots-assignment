import { Inject, Injectable } from '@nestjs/common';
import { ParentTeacherPort } from '../../port/parant-teacher.port';
import { GetTeacherInfoByLocationReqDto } from '../dto/recommended-teacher.req.dto';
import { RecommendedTeacherResDto } from '../dto/recommended-teacher.res.dto';
import { PARENT_TEACHER_PORT } from '../../port/parent-teacher.port.token';

@Injectable()
export class RecommendationQueryService {
  constructor(
    @Inject(PARENT_TEACHER_PORT)
    private readonly parentTeacherPort: ParentTeacherPort,
  ) {}

  public async recommendTeacher(
    dto: GetTeacherInfoByLocationReqDto,
  ): Promise<RecommendedTeacherResDto[]> {
    const teachers = await this.parentTeacherPort.recommendTeacherByLocation({
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
