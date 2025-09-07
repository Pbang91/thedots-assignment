import { NumericToNumber } from '@app/shared/utils/numeric.transformer';
import { Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'subway_station' })
export class SubwayStation {
  @PrimaryColumn('uuid', { default: () => 'uuid_generate_v7()' })
  id!: string;

  @Column('text', { nullable: false, unique: true })
  name!: string;

  @Column('numeric', { precision: 9, scale: 6, transformer: NumericToNumber })
  lat!: number;

  @Column('numeric', { precision: 9, scale: 6, transformer: NumericToNumber })
  lng!: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp', nullable: false })
  createdAt!: Date;
}
