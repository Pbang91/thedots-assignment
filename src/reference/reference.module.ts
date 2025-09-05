import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StationLine } from './domain/entities/station-line.entity';
import { SubwayLine } from './domain/entities/subway-line.entity';
import { SubwayStation } from './domain/entities/subway-station.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SubwayStation, SubwayLine, StationLine])],
  exports: [TypeOrmModule],
})
export class ReferenceModule {}
