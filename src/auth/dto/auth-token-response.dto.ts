import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../../common/enums/user-role.enum';

export class AuthTokenResponseUserDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'user01' })
  loginId: string;

  @ApiProperty({ example: '홍길동' })
  name: string;

  @ApiProperty({ enum: UserRole, example: UserRole.CLIENT })
  role: UserRole;
}

export class AuthTokenResponseDto {
  @ApiProperty({
    description: 'JWT 액세스 토큰',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  accessToken: string;

  @ApiProperty({ description: '리프레시 토큰', example: 'a1b2c3d4e5f6...' })
  refreshToken: string;

  @ApiProperty({ type: AuthTokenResponseUserDto })
  user: AuthTokenResponseUserDto;
}

/** `/auth/refresh` — 액세스만 갱신, 리프레시 JWT·만료(7일)는 로그인 시점 기준 유지 */
export class RefreshAccessResponseDto {
  @ApiProperty({
    description: '새 JWT 액세스 토큰',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  accessToken: string;

  @ApiProperty({ type: AuthTokenResponseUserDto })
  user: AuthTokenResponseUserDto;
}