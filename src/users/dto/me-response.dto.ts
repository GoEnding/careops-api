import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Gender } from '../../common/enums/gender.enum';
import { UserRole } from '../../common/enums/user-role.enum';
import { UserStatus } from '../../common/enums/user-status.enum';

export class MeResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'user01' })
  loginId: string;

  @ApiProperty({ example: '홍길동' })
  name: string;

  @ApiProperty({ example: '1990-01-15' })
  birthDate: string;

  @ApiPropertyOptional({ enum: Gender })
  gender: Gender | null;

  @ApiPropertyOptional({ example: 'user@example.com' })
  email: string | null;

  @ApiPropertyOptional({ example: '01012345678' })
  phoneNumber: string;

  @ApiProperty({ enum: UserRole })
  role: UserRole;

  @ApiProperty({ enum: UserStatus })
  status: UserStatus;

  @ApiPropertyOptional()
  emailVerifiedAt: Date | null;

  @ApiPropertyOptional()
  phoneVerifiedAt: Date | null;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
