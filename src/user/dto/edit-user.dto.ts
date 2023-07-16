import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class EditUserDto {
  @ApiProperty()
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  firstName?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  lastName?: string;

  @ApiProperty({ required: false, nullable: true })
  @IsPhoneNumber()
  @IsOptional()
  phoneNumber?: string;
}
