import { ApiProperty } from '@nestjs/swagger';
import {
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  Max,
  Min,
} from 'class-validator';

export class GetTeacherInfoByLocationReqDto {
  @ApiProperty({
    description: '검색하려는 주소의 위도',
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
    description: '검색하려는 주소의 경도',
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

  @ApiProperty({
    description: '검색하려는 주소(대분류)',
    required: true,
    type: String,
    example: '서울시 종로구',
  })
  @IsString()
  address!: string;

  @ApiProperty({
    description: '검색하려는 주소의 우편번호',
    required: true,
    type: String,
    example: '03152',
  })
  @Matches(/^\d{5}$/)
  zipcode!: string;

  @ApiProperty({
    description: '검색하려는 주소(상세 주소)',
    required: false,
    type: String,
    example: '시청',
  })
  @IsOptional()
  @IsString()
  addrDetail?: string;
}
