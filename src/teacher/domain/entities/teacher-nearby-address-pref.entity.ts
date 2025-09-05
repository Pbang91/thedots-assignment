import { NumericToNumber } from 'src/shared/utils/numeric.transformer';
import { Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'teacher_nearby_address_pref' })
export class TeacherNearbyAddressPref {
  @PrimaryColumn('uuid', { default: () => 'uuid_generate_v7()' })
  id!: string;

  @Column('uuid', { name: 'teacher_id', nullable: false })
  teacherId!: string;

  @Column('numeric', { precision: 9, scale: 6, transformer: NumericToNumber })
  lat!: number;

  @Column('numeric', { precision: 9, scale: 6, transformer: NumericToNumber })
  lng!: number;

  @Column('numeric', {
    name: 'radius_km',
    precision: 5,
    scale: 2,
    default: 5.0,
    transformer: NumericToNumber,
  })
  radiusKm!: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp', nullable: false })
  createdAt!: Date;
}
