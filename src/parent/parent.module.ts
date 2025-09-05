import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Parent } from './domain/entities/parent.entity';
import { JobPostAddress } from './domain/entities/job-post-address.entity';
import { JobPost } from './domain/entities/job-post.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Parent, JobPost, JobPostAddress])],
  exports: [TypeOrmModule],
})
export class ParentModule {}
