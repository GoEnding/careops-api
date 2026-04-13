import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

/** 본문으로 보낼 때만 사용. `Authorization: Bearer <리프레시>` 가 있으면 본문은 생략 가능 */
export class RefreshTokenDto {
  @ApiPropertyOptional({
    description:
      '리프레시 토큰(JWT). `Authorization: Bearer <리프레시 토큰>` 헤더와 택일(헤더 우선).',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  @IsOptional()
  @IsString()
  refreshToken?: string;
}