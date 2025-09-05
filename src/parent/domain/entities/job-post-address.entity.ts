import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'job_post_address' })
export class JobPostAddress {
  @PrimaryColumn('uuid', { default: () => 'uuid_generate_v7()' })
  id!: string;

  @Column('text', { name: 'addr_detail', nullable: false })
  addrDetail!: string;

  @Column('text', { name: 'sigungu', nullable: false })
  sigungu!: string;

  @Column('text', { name: 'sido', nullable: false })
  sido!: string;

  @Column('text', { name: 'zipcode', nullable: false })
  zipcode!: string;
}
