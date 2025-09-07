import { NumericToNumber } from '@app/shared/utils/numeric.transformer';
import { Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'teacher_station_pref' })
export class TeacherStationPref {
  @PrimaryColumn('uuid', { default: () => 'uuid_generate_v7()' })
  id!: string;

  @Column('uuid', { name: 'teacher_id', nullable: false })
  teacherId!: string;

  @Column('uuid', { name: 'subway_station_id', nullable: false })
  subwayStationId!: string;

  @Column('numeric', {
    name: 'radius_km',
    precision: 5,
    scale: 2,
    default: 1.0,
    transformer: NumericToNumber,
  })
  radiusKm!: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp', nullable: false })
  createdAt!: Date;
}
