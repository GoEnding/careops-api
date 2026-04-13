import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import type { Request } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { JwtAuthUser } from '../auth/types/jwt-auth-user.interface';
import { MeResponseDto } from './dto/me-response.dto';
import { UsersService } from './users.service';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiOperation({ summary: '내 정보 조회 (액세스 토큰 필요)' })
  @ApiOkResponse({ type: MeResponseDto })
  async getMe(@Req() req: Request & { user: JwtAuthUser }) {
    return this.usersService.getMe(req.user.id);
  }
}
