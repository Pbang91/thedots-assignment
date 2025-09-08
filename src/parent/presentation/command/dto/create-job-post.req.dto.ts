import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  Matches,
  IsNumber,
  Min,
  Max,
} from 'class-validator';

export class CreateJobPostReqDto {
  @ApiProperty({
    description: '공고 상세 설명',
    required: false,
    nullable: true,
    type: String,
    example: '친절한 선생님이 좋아요',
  })
  @IsOptional()
  @IsString()
  detail?: string;

  @ApiProperty({
    description: '공고 상세 주소',
    required: true,
    type: String,
    example: '서울시 강남구 테헤란로 123',
  })
  @IsString({ message: '상세 주소는 필수입니다' })
  addrDetail!: string;

  @ApiProperty({
    description: '시군구',
    required: true,
    type: String,
    example: '강남구',
  })
  @IsString({ message: '시군구는 필수 입니다' })
  sigungu!: string;

  @ApiProperty({
    description: '시도',
    required: true,
    type: String,
    example: '서울특별시',
  })
  @IsString({ message: '시도는 필수 입니다' })
  sido!: string;

  @ApiProperty({
    description: '우편번호',
    required: true,
    type: String,
    example: '06236',
  })
  @IsString()
  @Matches(/^\d{5}$/)
  zipcode!: string;

  @ApiProperty({
    description: '위도',
    required: true,
    minimum: -90,
    maximum: 90,
    type: Number,
    example: 37.57,
  })
  @IsNumber()
  @Min(-90)
  @Max(90)
  lat!: number;

  @ApiProperty({
    description: '경도',
    required: true,
    minimum: -180,
    maximum: 180,
    type: Number,
    example: 126.98,
  })
  @IsNumber()
  @Min(-180)
  @Max(180)
  lng!: number;
}
