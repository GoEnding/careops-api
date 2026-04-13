import {
  BadRequestException,
  Body,
  Controller,
  Headers,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { extractBearerToken } from '../common/utils/bearer-token.util';
import { AuthService } from './auth.service';
import {
  AuthTokenResponseDto,
  RefreshAccessResponseDto,
} from './dto/auth-token-response.dto';
import { RegisterClientDto } from './dto/register-client.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import type { Request } from 'express';
import type { JwtAuthUser } from './types/jwt-auth-user.interface';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register/client')
  @ApiOperation({ summary: '클라이언트 회원가입' })
  @ApiBody({ type: RegisterClientDto })
  @ApiOkResponse({
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number', example: 1 },
        loginId: { type: 'string', example: 'client01' },
      },
    },
  })
  async registerClient(@Body() dto: RegisterClientDto) {
    return this.authService.registerClient(dto);
  }

  @Post('login')
  @ApiOperation({ summary: '로그인 (액세스·리프레시 토큰 발급)' })
  @ApiBody({ type: LoginDto })
  @ApiOkResponse({ type: AuthTokenResponseDto })
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('refresh')
  @ApiBearerAuth('refresh-token')
  @ApiOperation({
    summary: '액세스 토큰만 재발급 (리프레시 JWT는 로그인 때 받은 것 그대로 사용)',
    description:
      '`Authorization: Bearer <리프레시 JWT>`(권장) 또는 본문 `refreshToken`. 리프레시 토큰 만료(7일)는 로그인 시점부터이며, 갱신해도 연장되지 않습니다. 새 리프레시 JWT는 재로그인 시에만 발급됩니다.',
  })
  @ApiBody({ type: RefreshTokenDto, required: false })
  @ApiOkResponse({ type: RefreshAccessResponseDto })
  async refresh(
    @Headers('authorization') authorization: string | undefined,
    @Body() dto: RefreshTokenDto,
  ) {
    const fromHeader = extractBearerToken(authorization);
    const token = fromHeader ?? dto.refreshToken?.trim();
    if (!token) {
      throw new BadRequestException(
        '리프레시 토큰이 필요합니다. Authorization: Bearer 헤더 또는 본문 refreshToken을 사용하세요.',
      );
    }
    return this.authService.refreshTokens(token);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @ApiOperation({ summary: '로그아웃 (리프레시 토큰 무효화)' })
  @ApiResponse({ status: 200, description: '성공 (본문 없음)' })
  async logout(@Req() req: Request & { user: JwtAuthUser }) {
    return this.authService.logout(req.user.id);
  }
}