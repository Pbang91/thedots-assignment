import { Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';
import { TeacherDeviceTokenPlatform } from '../enums/teacher-device-token.type';

@Entity({ name: 'teacher_device_token' })
export class TeacherDeviceToken {
  @PrimaryColumn('uuid', { default: () => 'uuid_generate_v7()' })
  id!: string;

  @Column('uuid', { name: 'teacher_id', nullable: false })
  teacherId!: string;

  @Column('text', { nullable: false })
  token!: string;

  @Column('text', { nullable: false })
  platform!: TeacherDeviceTokenPlatform;

  @Column('boolean', { name: 'is_active', nullable: false, default: true })
  isActive = true;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp', nullable: false })
  createdAt!: Date;
}
