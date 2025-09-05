import { Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'parent' })
export class Parent {
  @PrimaryColumn('uuid', { default: () => 'uuid_generate_v7()' })
  id!: string;
}
