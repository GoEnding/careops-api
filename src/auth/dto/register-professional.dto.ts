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
import { ProfessionalType } from '../../common/enums/professional-type.enum';
import { ProfessionalVerificationTrack } from '../../common/enums/professional-verification-track.enum';

export class RegisterProfessionalDto {
  @ApiProperty({ example: 'pro01', minLength: 4, maxLength: 30 })
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

  @ApiProperty({ example: '김전문', maxLength: 30 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  @Transform(({ value }) => String(value).trim())
  name: string;

  @ApiPropertyOptional({ example: 'doc@example.com', maxLength: 100 })
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

  @ApiProperty({ enum: ProfessionalType, example: ProfessionalType.DOCTOR })
  @IsEnum(ProfessionalType, {
    message: 'professionalType은 허용된 전문가 직군 값이어야 합니다.',
  })
  professionalType: ProfessionalType;

  @ApiProperty({
    enum: ProfessionalVerificationTrack,
    example: ProfessionalVerificationTrack.MOHW_LICENSE,
  })
  @IsEnum(ProfessionalVerificationTrack, {
    message: 'verificationTrack은 허용된 검증 경로 값이어야 합니다.',
  })
  verificationTrack: ProfessionalVerificationTrack;

  @ApiPropertyOptional({ maxLength: 100 })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  @Transform(({ value }) =>
    value === undefined || value === null || value === ''
      ? undefined
      : String(value).trim(),
  )
  specialty?: string;

  @ApiPropertyOptional({ maxLength: 100 })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  @Transform(({ value }) =>
    value === undefined || value === null || value === ''
      ? undefined
      : String(value).trim(),
  )
  orgName?: string;

  @ApiPropertyOptional({ maxLength: 50 })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  @Transform(({ value }) =>
    value === undefined || value === null || value === ''
      ? undefined
      : String(value).trim(),
  )
  licenseNumber?: string;

  @ApiPropertyOptional({ maxLength: 100 })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  @Transform(({ value }) =>
    value === undefined || value === null || value === ''
      ? undefined
      : String(value).trim(),
  )
  subQualification?: string;

  @ApiPropertyOptional({ example: 'work@hospital.kr', maxLength: 100 })
  @IsOptional()
  @IsEmail({}, { message: '올바른 재직 이메일 형식이어야 합니다.' })
  @MaxLength(100)
  @Transform(({ value }) =>
    value === undefined || value === null || value === ''
      ? undefined
      : String(value).trim().toLowerCase(),
  )
  workEmail?: string;

  @ApiPropertyOptional({ maxLength: 50 })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  @Transform(({ value }) =>
    value === undefined || value === null || value === ''
      ? undefined
      : String(value).trim(),
  )
  jobTitle?: string;

  @ApiPropertyOptional({ maxLength: 1000 })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  @Transform(({ value }) =>
    value === undefined || value === null || value === ''
      ? undefined
      : String(value).trim(),
  )
  introduction?: string;
}