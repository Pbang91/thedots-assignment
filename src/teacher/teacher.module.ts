import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Teacher } from './domain/entities/teacher.entity';
import { TeacherNearbyAddressPref } from './domain/entities/teacher-nearby-address-pref.entity';
import { TeacherRegionPref } from './domain/entities/teacher-region-preff.entity';
import { TeacherStationPref } from './domain/entities/teacher-station-pref.entity';
import { TeacherQueryAdapter } from './infrastructure/query/teacher-query.adapter';
import { TEACHER_QUERY_PORT } from './application/query/port/teacher-query.port.token';
import { ReferenceModule } from 'src/reference/reference.module';
import { AuthModule } from 'src/shared/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Teacher,
      TeacherNearbyAddressPref,
      TeacherRegionPref,
      TeacherStationPref,
    ]),
    AuthModule,
    ReferenceModule,
  ],
  providers: [{ provide: TEACHER_QUERY_PORT, useClass: TeacherQueryAdapter }],
  exports: [TypeOrmModule, TEACHER_QUERY_PORT],
})
export class TeacherMoodule {}
