import { ApiProperty } from '@nestjs/swagger';

class User {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'test@gmail.com' })
  email: string;

  @ApiProperty({ example: 'John' })
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  lastName: string;

  @ApiProperty({ required: false, nullable: true, example: '+447911123456' })
  phoneNumber: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class GetUserResponse extends User {}

export class EditUserResponse extends User {}
