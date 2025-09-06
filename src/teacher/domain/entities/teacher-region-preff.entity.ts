import { Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'teacher_region_pref' })
export class TeacherRegionPref {
  @PrimaryColumn('uuid', { default: () => 'uuid_generate_v7()' })
  id!: string;

  @Column('uuid', { name: 'teacher_id', nullable: false })
  teacherId!: string;

  @Column('text', { name: 'region_level', nullable: true })
  regionLevel?: string;

  @Column('varchar', { name: 'sido_code', length: 20, nullable: true })
  sidoCode?: string;

  @Column('varchar', { name: 'sigungu_code', length: 20, nullable: true })
  sigunguCode?: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp', nullable: false })
  createdAt!: Date;
}
