# CareOps API

AI 상담 기반 진료과 안내 및 기관 검토 업무시스템형 백엔드 프로젝트입니다.

사용자가 증상/불편 사항을 입력하면, AI 상담 결과를 바탕으로 상담 내용을 구조화하고 권장 진료과 및 방문 필요도를 안내하며, 필요 시 상담 내용을 문서 초안으로 생성하고 기관 담당자가 이를 검토할 수 있는 흐름을 목표로 설계하고 있습니다.

## 프로젝트 개요

CareOps API는 병원/기관 중심의 상담 업무시스템을 가정한 개인 백엔드 포트폴리오 프로젝트입니다.

현재는 인증 및 사용자 기본 흐름을 우선 구현하고 있으며, 이후 상담 생성, AI 결과 저장, 문서 초안, 기관 검토 프로세스까지 확장할 예정입니다.

## 기술 스택

- NestJS
- TypeScript
- MySQL
- TypeORM
- JWT
- bcrypt
- class-validator
- class-transformer
- Swagger

## 현재 구현 완료

- CLIENT 회원가입 API 구현 및 테스트
- 로그인 API 구현 및 테스트
- 로그아웃 API 구현
- 내 정보 조회 API 구현 및 테스트
- JWT Access Token / Refresh Token 기반 인증 구조 적용
- Refresh Token 해시 저장 및 토큰 무효화 흐름 반영
- User / ProfessionalProfile 엔티티 설계
- MySQL 테이블 생성 및 API 연동 확인
- Swagger 기반 API 문서화 및 실행 검증

## 현재 구현된 인증 흐름

1. 회원가입
   - CLIENT 사용자 계정 생성
   - 비밀번호 해시 저장
   - 생년월일 필수, 성별 선택값 반영

2. 로그인
   - 로그인 성공 시 Access Token / Refresh Token 발급
   - Refresh Token은 해시 형태로 DB 저장

3. 내 정보 조회
   - Access Token이 필요한 보호 API
   - JwtAuthGuard / JwtStrategy를 통해 인증 후 사용자 정보 반환

4. 로그아웃
   - 저장된 Refresh Token 무효화
   - 토큰 버전 관리로 기존 토큰 재사용 방지 구조 반영

## 진행 중

- 전문가 회원가입 및 프로필 흐름 고도화
- 상담 생성 구조 설계
- AI 상담 결과 저장 구조 설계
- ERD 및 README 문서 정리

## 이후 진행 예정

- AI 상담 결과 기반 진료과 추천
- 방문 필요도 안내 로직
- 상담 내용 문서 초안 생성
- 기관 담당자 검토 프로세스
- 상담 상태 이력 관리
- 위치 기반 기관/병원 추천 흐름

## API Preview

### Swagger Overview
<img width="1487" height="976" alt="스크린샷 2026-04-13 155635" src="https://github.com/user-attachments/assets/5fa6d639-3f49-4eea-8642-242c1e4e7f48" />


### Client Register API
<img width="1602" height="1163" alt="스크린샷 2026-04-13 155140" src="https://github.com/user-attachments/assets/024692f3-45de-481f-8ba5-5600ce9ac003" />


### Login API
<img width="1410" height="1127" alt="스크린샷 2026-04-13 155229" src="https://github.com/user-attachments/assets/08218537-3ecd-456b-b753-8cc1670ed27e" />


### My Profile API
<img width="1427" height="1071" alt="스크린샷 2026-04-13 155328" src="https://github.com/user-attachments/assets/17708354-1a8c-4f61-ac88-ff376236abd1" />


## 엔드포인트 예시

- `POST /auth/register/client`
- `POST /auth/login`
- `POST /auth/refresh`
- `POST /auth/logout`
- `GET /users/me`

## 실행 방법

### 1. 프로젝트 설치
```bash
pnpm install
```

### 2. 환경변수 설정
- .env 파일에 DB / JWT 관련 환경 변수를 설정합니다.

```
PORT=3000

DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=your_password
DB_DATABASE=careops

JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
JWT_ACCESS_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d
```

### 3. 개발서버 진행
```
pnpm run start:dev
```

### 4. Swagger 접속
```
http://localhost:3000/api#
```
## 설계 메모
- 사용자 고정 속성은 users 엔티티 중심으로 관리
- 위치 정보는 회원가입 시 저장하지 않고, 향후 상담 진입 시점에 사용하는 방향으로 설계
- 인증은 JWT 기반으로 구현하며, Refresh Token은 평문 저장이 아닌 해시 저장 방식 적용
- 입력값 검증은 DTO + ValidationPipe 기반으로 처리
  
## 프로젝트 목적

이 프로젝트는 단순 CRUD 구현보다,
실무형 백엔드에서 중요한 아래 요소를 직접 설계하고 구현하는 데 목적이 있습니다.

- 인증/인가 구조 설계
- 사용자/전문가 도메인 분리
- DTO 검증
- 엔티티 및 DB 매핑
- API 문서화
- 향후 AI 상담 및 업무시스템 프로세스 확장 가능 구조 설계

