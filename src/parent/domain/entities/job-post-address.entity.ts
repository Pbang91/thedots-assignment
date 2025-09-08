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

  static create(data: {
    addrDetail: string;
    sigungu: string;
    sido: string;
    zipcode: string;
  }): JobPostAddress {
    const { addrDetail, sigungu, sido, zipcode } = data;

    const jpAddr = new JobPostAddress();

    jpAddr.addrDetail = addrDetail.trim();
    jpAddr.sigungu = sigungu.trim();
    jpAddr.sido = sido.trim();
    jpAddr.zipcode = zipcode.trim();

    return jpAddr;
  }
}
