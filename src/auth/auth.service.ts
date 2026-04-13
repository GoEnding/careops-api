import {
    BadRequestException,
    ConflictException,
    Injectable,
    UnauthorizedException,
  } from '@nestjs/common';
  import { InjectRepository } from '@nestjs/typeorm';
  import { JwtService } from '@nestjs/jwt';
  import { Repository } from 'typeorm';
  import * as bcrypt from 'bcrypt';
  
  import { User } from '../users/entity/user.entity';
  import { UserRole } from '../common/enums/user-role.enum';
  import { UserStatus } from '../common/enums/user-status.enum';
  import { RegisterClientDto } from './dto/register-client.dto';
  import { LoginDto } from './dto/login.dto';
  import {
    AuthTokenResponseDto,
    RefreshAccessResponseDto,
  } from './dto/auth-token-response.dto';
  import {
    ACCESS_TOKEN_EXPIRES_IN,
    REFRESH_TOKEN_EXPIRES_IN,
  } from '../common/utils/token-expiration.util';
  import { hashRefreshToken,compareRefreshToken } from '../common/utils/token-hash.util';
  import { ConfigService } from '@nestjs/config';
  
  @Injectable()
  export class AuthService {
    constructor(
      @InjectRepository(User)
      private readonly usersRepository: Repository<User>,
      private readonly jwtService: JwtService,
      private readonly configService: ConfigService,
    ) {}
  
    async registerClient(dto: RegisterClientDto): Promise<{ id: number; loginId: string }> {
      if (dto.password !== dto.passwordConfirm) {
        throw new BadRequestException('비밀번호와 비밀번호 확인이 일치하지 않습니다.');
      }
  
      const normalizedLoginId = dto.loginId.trim();
      const normalizedEmail = dto.email?.trim().toLowerCase() ?? null;
      const normalizedPhoneNumber = dto.phoneNumber.replace(/-/g, '').trim();
  
      const existingLoginId = await this.usersRepository.findOne({
        where: { loginId: normalizedLoginId },
      });
  
      if (existingLoginId) {
        throw new ConflictException('이미 사용 중인 로그인 아이디입니다.');
      }
  
      if (normalizedEmail) {
        const existingEmail = await this.usersRepository.findOne({
          where: { email: normalizedEmail },
        });
  
        if (existingEmail) {
          throw new ConflictException('이미 사용 중인 이메일입니다.');
        }
      }
  
      const existingPhoneNumber = await this.usersRepository.findOne({
        where: { phoneNumber: normalizedPhoneNumber },
      });
  
      if (existingPhoneNumber) {
        throw new ConflictException('이미 사용 중인 휴대폰 번호입니다.');
      }
  
      const birthDateStr = dto.birthDate.trim();
      if (!this.isValidCalendarDateString(birthDateStr)) {
        throw new BadRequestException('유효하지 않은 생년월일입니다.');
      }
      const birthDate = new Date(`${birthDateStr}T00:00:00.000Z`);
  
      const gender = dto.gender ?? null;
  
      const hashedPassword = await bcrypt.hash(dto.password, 10);
  
      const user = this.usersRepository.create({
        loginId: normalizedLoginId,
        password: hashedPassword,
        name: dto.name.trim(),
        birthDate,
        gender,
        email: normalizedEmail,
        emailVerifiedAt: null,
        phoneNumber: normalizedPhoneNumber,
        phoneVerifiedAt: new Date(),
        role: UserRole.CLIENT,
        status: UserStatus.ACTIVE,
        tokenVersion: 0,
      });
  
      const savedUser = await this.usersRepository.save(user);
  
      return {
        id: savedUser.id,
        loginId: savedUser.loginId,
      };
    }
  
    private isValidCalendarDateString(yyyyMmDd: string): boolean {
      const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(yyyyMmDd);
      if (!m) {
        return false;
      }
      const y = Number(m[1]);
      const mo = Number(m[2]);
      const d = Number(m[3]);
      const dt = new Date(Date.UTC(y, mo - 1, d));
      return (
        dt.getUTCFullYear() === y &&
        dt.getUTCMonth() === mo - 1 &&
        dt.getUTCDate() === d
      );
    }
  
    async login(dto: LoginDto): Promise<AuthTokenResponseDto> {
      const normalizedLoginId = dto.loginId.trim();
  
      const user = await this.usersRepository
        .createQueryBuilder('user')
        .addSelect('user.password')
        .addSelect('user.refreshTokenHash')
        .where('user.login_id = :loginId', { loginId: normalizedLoginId })
        .getOne();
  
      if (!user) {
        throw new UnauthorizedException('로그인 아이디 또는 비밀번호가 올바르지 않습니다.');
      }
  
      if (user.status !== UserStatus.ACTIVE) {
        throw new UnauthorizedException('현재 사용할 수 없는 계정입니다.');
      }
  
      const isPasswordMatched = await bcrypt.compare(dto.password, user.password);
  
      if (!isPasswordMatched) {
        throw new UnauthorizedException('로그인 아이디 또는 비밀번호가 올바르지 않습니다.');
      }
  
      user.tokenVersion += 1;
  
      const payload = {
        sub: user.id,
        loginId: user.loginId,
        role: user.role,
        tokenVersion: user.tokenVersion,
      };
  
      const accessToken = await this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
        expiresIn: ACCESS_TOKEN_EXPIRES_IN,
      });
      
      const refreshToken = await this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: REFRESH_TOKEN_EXPIRES_IN,
      });
      
      user.refreshTokenHash = await hashRefreshToken(refreshToken, 12);
      await this.usersRepository.save(user);
  
      return {
        accessToken,
        refreshToken,
        user: {
          id: user.id,
          loginId: user.loginId,
          name: user.name,
          role: user.role,
        },
      };
    }

    async refreshTokens(refreshToken: string): Promise<RefreshAccessResponseDto> {
        let payload: {
          sub: number;
          loginId: string;
          role: UserRole;
          tokenVersion: number;
        };
      
        try {
          payload = await this.jwtService.verifyAsync(refreshToken, {
            secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
          });
        } catch (error) {
          throw new UnauthorizedException('유효하지 않거나 만료된 리프레시 토큰입니다.');
        }
      
        const user = await this.usersRepository
          .createQueryBuilder('user')
          .addSelect('user.refreshTokenHash')
          .where('user.id = :id', { id: payload.sub })
          .getOne();
      
        if (!user) {
          throw new UnauthorizedException('존재하지 않는 사용자입니다.');
        }
      
        if (user.status !== UserStatus.ACTIVE) {
          throw new UnauthorizedException('현재 사용할 수 없는 계정입니다.');
        }
      
        if (user.tokenVersion !== payload.tokenVersion) {
          throw new UnauthorizedException('토큰이 만료되었습니다. 다시 로그인해주세요.');
        }
      
        if (!user.refreshTokenHash) {
          throw new UnauthorizedException('리프레시 토큰 정보가 없습니다.');
        }
      
        const isRefreshTokenMatched = await compareRefreshToken(
          refreshToken,
          user.refreshTokenHash,
        );
      
        if (!isRefreshTokenMatched) {
          throw new UnauthorizedException('리프레시 토큰이 일치하지 않습니다.');
        }
      
        const newPayload = {
          sub: user.id,
          loginId: user.loginId,
          role: user.role,
          tokenVersion: user.tokenVersion,
        };
      
        const newAccessToken = await this.jwtService.signAsync(newPayload, {
          secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
          expiresIn: ACCESS_TOKEN_EXPIRES_IN,
        });
      
        return {
          accessToken: newAccessToken,
          user: {
            id: user.id,
            loginId: user.loginId,
            name: user.name,
            role: user.role,
          },
        };
      }
  
    async logout(userId: number): Promise<void> {
        const user = await this.usersRepository.findOne({
          where: { id: userId },
        });
      
        if (!user) {
          throw new UnauthorizedException('존재하지 않는 사용자입니다.');
        }
      
        user.refreshTokenHash = null;
        user.tokenVersion += 1;
      
        await this.usersRepository.save(user);
      }
  }