import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  Unique,
} from 'typeorm';

@Entity({ name: 'station_line' })
@Unique(['subwayStationId', 'subwayLineId'])
export class StationLine {
  @PrimaryColumn('uuid', { default: () => 'uuid_generate_v7()' })
  id!: string;

  @Column('uuid', { name: 'subway_station_id', nullable: false })
  subwayStationId!: string;

  @Column('uuid', { name: 'subway_line_id', nullable: false })
  subwayLineId!: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp', nullable: false })
  createdAt!: Date;
}
