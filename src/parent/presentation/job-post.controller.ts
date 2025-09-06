import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/shared/auth/jwt.guard';
import { Roles, ROLES } from 'src/shared/auth/roles.decorator';
import { RolesGuard } from 'src/shared/auth/roles.guard';
import { CreateJobPostReqDto } from '../application/command/dto/create-job-post.req.dto';
import { RecommendedTeacherResDto } from '../application/command/dto/recommended-teacher.res.dto';
import { CreateJobPostHandler } from '../application/command/service/create-job-post.handler';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('JobPost')
export class JobPostController {
  constructor(private readonly handler: CreateJobPostHandler) {}

  @Post()
  @Roles(ROLES.PARENT)
  async create(
    @Body() dto: CreateJobPostReqDto,
  ): Promise<RecommendedTeacherResDto[]> {
    return await this.handler.execute(dto);
  }
}
