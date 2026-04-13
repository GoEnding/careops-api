import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../users/entity/user.entity';
import { UserRole } from '../../common/enums/user-role.enum';
import { UserStatus } from '../../common/enums/user-status.enum';
import type { JwtAuthUser } from '../types/jwt-auth-user.interface';

interface JwtPayload {
  sub: number;
  loginId: string;
  role: UserRole;
  tokenVersion: number;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_ACCESS_SECRET'),
    });
  }

  async validate(payload: JwtPayload): Promise<JwtAuthUser> {
    const user = await this.usersRepository.findOne({
      where: { id: payload.sub },
    });

    if (!user) {
      throw new UnauthorizedException('존재하지 않는 사용자입니다.');
    }

    if (user.tokenVersion !== payload.tokenVersion) {
      throw new UnauthorizedException('토큰이 만료되었습니다. 다시 로그인해주세요.');
    }

    if (user.status !== UserStatus.ACTIVE) {
      throw new UnauthorizedException('현재 사용할 수 없는 계정입니다.');
    }

    return {
      id: user.id,
      loginId: user.loginId,
      name: user.name,
      role: user.role,
    };
  }
}