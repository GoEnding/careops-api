import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { databaseConfig } from './config/database.config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProfessionalsModule } from './professionals/professionals.module';

@Module({
  imports: [
    ConfigModule.forRoot({ // ConfigModule을 전역 초기화한다.
      isGlobal: true, // 다른 모듈에서 매번 ConfigModule을 import하지 않아도 전역으로 쓸 수 있게 한다.즉 한 번 등록하면 앱 전체에서 사용 가능하다.
    }), // 이건 앱 시작 시 .env를 읽어오는 설정이다.
    TypeOrmModule.forRootAsync(databaseConfig), // 이 줄이 진짜 DB 연결 시작점이다.
    AuthModule,
    UsersModule,
    ProfessionalsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}