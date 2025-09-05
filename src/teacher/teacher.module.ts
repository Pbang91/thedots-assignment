import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Teacher } from './domain/entities/teacher.entity';
import { TeacherNearbyAddressPref } from './domain/entities/teacher-nearby-address-pref.entity';
import { TeacherRegioPref } from './domain/entities/teacher-region-preff.entity';
import { TeacherStationPref } from './domain/entities/teacher-station-pref.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Teacher,
      TeacherNearbyAddressPref,
      TeacherRegioPref,
      TeacherStationPref,
    ]),
  ],
  exports: [TypeOrmModule],
})
export class TeacherMoodule {}
