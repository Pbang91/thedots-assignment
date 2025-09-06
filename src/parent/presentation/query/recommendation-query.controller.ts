import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/shared/auth/jwt.guard';
import { Roles, ROLES } from 'src/shared/auth/roles.decorator';
import { RolesGuard } from 'src/shared/auth/roles.guard';
import { GetTeacherInfoByLocationReqDto } from '../../application/query/dto/recommended-teacher.req.dto';
import { RecommendedTeacherResDto } from '../../application/query/dto/recommended-teacher.res.dto';
import { RecommendationQueryService } from '../../application/query/service/recommendation-query.service';
import {
  ApiBearerAuth,
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('recommendation')
@ApiTags('RecommendationQuery')
export class RecommendationQueryController {
  constructor(private readonly handler: RecommendationQueryService) {}

  @Get()
  @Roles(ROLES.PARENT)
  @ApiBearerAuth()
  @ApiOperation({
    summary: '특정 위치에서 컨택이 가능한 선생님 정보를 반환하는 API',
    description: `
      특정 위치 정보(위도, 경도, 주소, 우편번호)를 전달하면
      아래 3가지 조건 중 하나에 속하는 선생님 정보를 전달합니다.

      1) 5km 반경 인근 주소에서 활동하는 선생님
      2) 특정 위치가 속한 지역에서 활동하는 선생님
      3) 1km 반경 지하철역을 기반으로 활동하는 선생님

      매칭 정보가 없다면 빈 배열을 반환합니다.

      최종 수정일: 2025.09.07
      `,
  })
  @ApiExtraModels(RecommendedTeacherResDto)
  @ApiOkResponse({
    description: '성공',
    type: RecommendedTeacherResDto,
    isArray: true,
  })
  async getTeacherInfoByLocation(
    @Query() dto: GetTeacherInfoByLocationReqDto,
  ): Promise<RecommendedTeacherResDto[]> {
    return await this.handler.execute(dto);
  }
}
