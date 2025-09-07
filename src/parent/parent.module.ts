import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Parent } from './domain/entities/parent.entity';
import { JobPostAddress } from './domain/entities/job-post-address.entity';
import { JobPost } from './domain/entities/job-post.entity';
import { RecommendationQueryController } from './presentation/query/recommendation-query.controller';
import { RecommendationQueryService } from './application/query/service/recommendation-query.service';
import { ParentTeacherAdapter } from './infrastructure/query/adpter/parent-teacher.adapter';
import { TeacherMoodule } from 'src/teacher/teacher.module';
import { ReferenceModule } from 'src/reference/reference.module';
import { GEOCODING_PORT } from './application/query/port/gecording.port.token';
import { PARENT_TEACHER_PORT } from './application/query/port/parent-teacher.port.token';
import { AuthModule } from 'src/shared/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Parent, JobPost, JobPostAddress]),
    TeacherMoodule,
    ReferenceModule,
    AuthModule,
  ],
  controllers: [RecommendationQueryController],
  providers: [
    { provide: PARENT_TEACHER_PORT, useClass: ParentTeacherAdapter },
    { provide: GEOCODING_PORT, useValue: { reverse: async () => ({}) } },
    RecommendationQueryService,
  ],
  exports: [TypeOrmModule],
})
export class ParentModule {}
