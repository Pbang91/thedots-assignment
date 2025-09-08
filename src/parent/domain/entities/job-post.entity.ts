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

  static create(data: {parentId: string, jobPostAddressId: string, detail?: string}): JobPost {
    const {parentId, jobPostAddressId, detail} = data;

    const jp = new JobPost();

    jp.parentId = parentId;
    jp.jobPostAddressId = jobPostAddressId;
    jp.detail = detail;

    return jp;
  }
}
