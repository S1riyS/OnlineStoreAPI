import { ApiProperty } from '@nestjs/swagger';

export class ApiError {
  @ApiProperty({ example: 400 })
  statusCode: number;

  @ApiProperty({ example: 'Bad Request' })
  error: string;

  @ApiProperty({
    example: 'Message of this error',
    required: false,
    nullable: true,
  })
  message?: string;
}
