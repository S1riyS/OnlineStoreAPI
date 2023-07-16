import { ApiProperty } from '@nestjs/swagger';

export type Tokens = {
  access_token: string;
  refresh_token: string;
};

export class TokensType implements Tokens {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWI...' })
  access_token: string;

  @ApiProperty({ example: 'TA5MjQwLCJleHAiOjE2OTAxMTQwNDB9.lrZ6vxmbuMQW...' })
  refresh_token: string;
}
