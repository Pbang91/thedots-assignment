import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Parent } from '@app/parent/domain/entities/parent.entity';
import { JobPost } from '@app/parent/domain/entities/job-post.entity';
import { ReferenceModule } from '@app/reference/reference.module';
import { AuthModule } from '@app/shared/auth/auth.module';
import { TeacherMoodule } from '@app/teacher/teacher.module';
import { GEOCODING_PORT } from '@app/parent/application/port/gecording.port.token';
import { PARENT_TEACHER_PORT } from '@app/parent/application/port/parent-teacher.port.token';
import { RecommendationQueryService } from '@app/parent/application/query/service/recommendation-query.service';
import { JobPostAddress } from '@app/parent/domain/entities/job-post-address.entity';
import { ParentTeacherAdapter } from '@app/parent/infrastructure/adpter/parent-teacher.adapter';
import { RecommendationQueryController } from '@app/parent/presentation/query/recommendation-query.controller';
import { JobPostCommandService } from './application/command/service/job-post-command.service';
import { JobPostCommandController } from './presentation/command/job-post-command.controller';
import { PUSH_PORT } from './application/port/push.port.token';
import { FcmPushAdapter } from './infrastructure/adpter/push.fcm.adapter';

@Module({
  imports: [
    TypeOrmModule.forFeature([Parent, JobPost, JobPostAddress]),
    TeacherMoodule,
    ReferenceModule,
    AuthModule,
  ],
  controllers: [RecommendationQueryController, JobPostCommandController],
  providers: [
    { provide: PARENT_TEACHER_PORT, useClass: ParentTeacherAdapter },
    { provide: GEOCODING_PORT, useValue: { reverse: async () => ({}) } },
    RecommendationQueryService,
    JobPostCommandService,
    { provide: PUSH_PORT, useClass: FcmPushAdapter },
  ],
  exports: [TypeOrmModule],
})
export class ParentModule {}
