import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'teacher' })
export class Teacher {
  @PrimaryColumn('uuid', { default: () => 'uuid_generate_v7()' })
  id!: string;

  @Column('varchar', { length: 20, nullable: false })
  name!: string;

  @Column('varchar', { length: 11, nullable: false })
  phone!: string;

  @Column('boolean', { name: 'is_active', default: true })
  isActive = true;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp', nullable: false })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp', nullable: true })
  updatedAt?: Date;
}
