import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Parent } from './domain/entities/parent.entity';
import { JobPostAddress } from './domain/entities/job-post-address.entity';
import { JobPost } from './domain/entities/job-post.entity';
import { JobPostController } from './presentation/job-post.controller';
import { CreateJobPostHandler } from './application/command/service/create-job-post.handler';
import { ParentTeacherAdapter } from './infrastructure/adpter/parent-teacher.adpter';
import { TeacherMoodule } from 'src/teacher/teacher.module';
import { ReferenceModule } from 'src/reference/reference.module';
import { GEOCODING_PORT } from './application/command/port/gecording.port.token';
import { PARENT_TEACHER_PORT } from './application/command/port/parent-teacher.port.token';
import { AuthModule } from 'src/shared/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Parent, JobPost, JobPostAddress]),
    TeacherMoodule,
    ReferenceModule,
    AuthModule,
  ],
  controllers: [JobPostController],
  providers: [
    { provide: PARENT_TEACHER_PORT, useClass: ParentTeacherAdapter },
    { provide: GEOCODING_PORT, useValue: { reverse: async () => ({}) } },
    CreateJobPostHandler,
  ],
  exports: [TypeOrmModule],
})
export class ParentModule {}
