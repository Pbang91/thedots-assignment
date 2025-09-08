import { JobPostCommandService } from "@app/parent/application/command/service/job-post-command.service";
import { JwtAuthGuard } from "@app/shared/auth/jwt.guard";
import { ROLES, Roles } from "@app/shared/auth/roles.decorator";
import { RolesGuard } from "@app/shared/auth/roles.guard";
import { Body, Controller, Post, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiCreatedResponse, ApiExtraModels, ApiOperation, ApiTags } from "@nestjs/swagger";
import { CreateJobPostReqDto } from "./dto/create-job-post.req.dto";
import { CreateJobPostResDto } from "./dto/create-job-post.res.dto";

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('job-post')
@ApiTags('JobPostCommand')
export class JobPostCommandController {
  constructor (private readonly service: JobPostCommandService) {}

  @Post()
  @Roles(ROLES.PARENT)
  @ApiBearerAuth()
  @ApiOperation({
    summary: '공고 등록 API',
    description: '공고 저장 후 대상을 선별 후 웹/앱 푸시를 진행합니다'
  })
  @ApiExtraModels(CreateJobPostResDto)
  @ApiCreatedResponse({
    description: '성공',
    type: CreateJobPostResDto,
  })
  async create(@Body() dto: CreateJobPostReqDto, @Req() req: any): Promise<CreateJobPostResDto> {
    const id = req.user.sub;

    return await this.service.createJobPost({...dto, parentId: id});
  }
}