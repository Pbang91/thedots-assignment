import { ApiProperty } from "@nestjs/swagger";

export class CreateJobPostResDto {
  @ApiProperty({
    description: '새로 생선된 post id',
    required: true,
    type: String,
  })
  jobPostId!: string;

  constructor(jobPostId: string) {
    this.jobPostId = jobPostId;
  }
}