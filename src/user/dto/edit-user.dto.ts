import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class EditUserDto {
  @ApiProperty({ required: false, nullable: true })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({ required: false, nullable: true })
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  firstName?: string;

  @ApiProperty({ required: false, nullable: true })
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  lastName?: string;

  @ApiProperty({ required: false, nullable: true })
  @IsPhoneNumber()
  @IsOptional()
  phoneNumber?: string;
}
