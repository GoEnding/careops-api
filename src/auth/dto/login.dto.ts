import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'user01', minLength: 4, maxLength: 30 })
  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(30)
  @Transform(({ value }) => String(value).trim())
  loginId: string;

  @ApiProperty({ example: 'Password1!', minLength: 8, maxLength: 100 })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(100)
  password: string;
}