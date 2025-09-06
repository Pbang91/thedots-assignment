import {
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  Max,
  Min,
} from 'class-validator';

export class CreateJobPostReqDto {
  @IsNumber()
  @Min(-90)
  @Max(90)
  lat!: number;

  @IsNumber()
  @Min(-180)
  @Max(180)
  lng!: number;

  @IsString()
  address!: string;

  @Matches(/^\d{5}$/)
  zipcode!: string;

  @IsOptional()
  @IsString()
  addrDetail?: string;
}
