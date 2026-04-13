import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Gender } from '../../common/enums/gender.enum';

export class RegisterClientDto {
  @ApiProperty({ example: 'client01', minLength: 4, maxLength: 30 })
  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(30)
  @Matches(/^[a-zA-Z0-9_]+$/, {
    message: '로그인 아이디는 영문, 숫자, 언더스코어만 사용할 수 있습니다.',
  })
  @Transform(({ value }) => String(value).trim())
  loginId: string;

  @ApiProperty({ example: 'Password1!', minLength: 8, maxLength: 100 })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(100)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).+$/, {
    message:
      '비밀번호는 8자 이상이며, 영문 대문자, 영문 소문자, 숫자, 특수문자를 각각 최소 1개 이상 포함해야 합니다.',
  })
  password: string;

  @ApiProperty({ example: 'Password1!', minLength: 8, maxLength: 100 })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(100)
  passwordConfirm: string;

  @ApiProperty({ example: '홍길동', maxLength: 30 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  @Transform(({ value }) => String(value).trim())
  name: string;

  @ApiProperty({ example: '1990-01-15', description: 'YYYY-MM-DD' })
  @Transform(({ value }) =>
    value === undefined || value === null ? value : String(value).trim(),
  )
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/, {
    message: '생년월일은 YYYY-MM-DD 형식이어야 합니다.',
  })
  birthDate: string;

  @ApiPropertyOptional({ enum: Gender, example: Gender.MALE })
  @Transform(({ value }) =>
    value === undefined || value === null || value === '' ? undefined : value,
  )
  @IsOptional()
  @IsEnum(Gender, { message: '성별은 MALE 또는 FEMALE만 입력할 수 있습니다.' })
  gender?: Gender;

  @ApiPropertyOptional({ example: 'user@example.com', maxLength: 100 })
  @IsOptional()
  @IsEmail({}, { message: '올바른 이메일 형식이어야 합니다.' })
  @MaxLength(100)
  @Transform(({ value }) =>
    value === undefined || value === null || value === ''
      ? undefined
      : String(value).trim().toLowerCase(),
  )
  email?: string;

  @ApiProperty({ example: '01012345678', description: '하이픈 없이' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^01[0-9]\d{7,8}$/, {
    message: '휴대폰 번호는 하이픈 없이 입력해주세요.',
  })
  @Transform(({ value }) => String(value).replace(/-/g, '').trim())
  phoneNumber: string;
}