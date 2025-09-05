import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'job_post' })
export class JobPost {
  @PrimaryColumn('uuid', { default: () => 'uuid_generate_v7()' })
  id!: string;

  @Column('uuid', { name: 'parent_id', nullable: false })
  parentId!: string;

  @Column('uuid', { name: 'job_post_address_id', nullable: false })
  jobPostAddressId!: string;

  @Column('text', { nullable: true })
  detail?: string;
}
