import { ApiProperty } from '@nestjs/swagger';

export class RecommendedTeacherResDto {
  @ApiProperty({
    description: '선생님 이름',
    required: true,
    type: String,
    example: '김째깍',
  })
  name!: string;

  @ApiProperty({
    description: '선생님 번호',
    required: true,
    type: String,
    example: '01012345678',
  })
  phone!: string;

  constructor(name: string, phone: string) {
    this.name = name;
    this.phone = phone;
  }
}
