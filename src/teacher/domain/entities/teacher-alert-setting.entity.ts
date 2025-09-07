import { Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';
import { TeacherAlertMode } from '../enums/teacher-alert.type';

@Entity({ name: 'teacher_alert_setting' })
export class TeacherAlertSetting {
  @PrimaryColumn('uuid', { default: () => 'uuid_generate_v7()' })
  id!: string;

  @Column('uuid', { name: 'teacher_id', nullable: false })
  teacherId!: string;

  @Column('text', { nullable: false })
  mode!: TeacherAlertMode;

  @Column('boolean', { name: 'is_on', nullable: false, default: true })
  isOn = true;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp', nullable: false })
  createdAt!: Date;
}
