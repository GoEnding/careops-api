import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    Index,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
  } from 'typeorm';
  import { Gender } from '../../common/enums/gender.enum';
  import { UserRole } from '../../common/enums/user-role.enum';
  import { UserStatus } from '../../common/enums/user-status.enum';
  
  @Entity('users')
  @Index('uq_users_login_id', ['loginId'], { unique: true })
  @Index('uq_users_email', ['email'], { unique: true })
  @Index('uq_users_phone_number', ['phoneNumber'], { unique: true })
  export class User {
    @PrimaryGeneratedColumn({ unsigned: true })
    id: number;
  
    @Column({
      name: 'login_id',
      type: 'varchar',
      length: 30,
      nullable: false,
      comment: '로그인 아이디',
    })
    loginId: string;
  
    @Column({
      type: 'varchar',
      length: 255,
      nullable: false,
      select: false,
      comment: 'bcrypt 해시 비밀번호',
    })
    password: string;
  
    @Column({
      type: 'varchar',
      length: 30,
      nullable: false,
      comment: '사용자 이름',
    })
    name: string;
  
    @Column({
      name: 'birth_date',
      type: 'date',
      nullable: false,
      comment: '생년월일',
    })
    birthDate: Date;
  
    @Column({
      type: 'enum',
      enum: Gender,
      nullable: true,
      default: null,
      comment: '성별',
    })
    gender: Gender | null;
  
    @Column({
      type: 'varchar',
      length: 100,
      nullable: true,
      default: null,
      comment: '이메일',
    })
    email: string | null;
  
    @Column({
      name: 'email_verified_at',
      type: 'datetime',
      nullable: true,
      default: null,
      comment: '이메일 인증 완료 일시',
    })
    emailVerifiedAt: Date | null;
  
    @Column({
      name: 'phone_number',
      type: 'varchar',
      length: 20,
      nullable: false,
      comment: '휴대폰 번호',
    })
    phoneNumber: string;
  
    @Column({
      name: 'phone_verified_at',
      type: 'datetime',
      nullable: true,
      default: null,
      comment: '휴대폰 인증 완료 일시',
    })
    phoneVerifiedAt: Date | null;
  
    @Column({
      type: 'enum',
      enum: UserRole,
      default: UserRole.CLIENT,
      nullable: false,
      comment: '사용자 역할',
    })
    role: UserRole;
  
    @Column({
      type: 'enum',
      enum: UserStatus,
      default: UserStatus.ACTIVE,
      nullable: false,
      comment: '계정 상태',
    })
    status: UserStatus;

    @Column({
        name: 'refresh_token_hash',
        type: 'varchar',
        length: 255,
        nullable: true,
        default: null,
        select: false,
        comment: '리프레시 토큰 해시',
      })
      refreshTokenHash: string | null;
  
    @Column({
      name: 'token_version',
      type: 'int',
      unsigned: true,
      default: 0,
      nullable: false,
      comment: '토큰 무효화 버전',
    })
    tokenVersion: number;
  
    @CreateDateColumn({
      name: 'created_at',
      type: 'datetime',
      comment: '생성일시',
    })
    createdAt: Date;
  
    @UpdateDateColumn({
      name: 'updated_at',
      type: 'datetime',
      comment: '수정일시',
    })
    updatedAt: Date;
  
    @DeleteDateColumn({
      name: 'deleted_at',
      type: 'datetime',
      nullable: true,
      comment: '삭제일시(소프트 삭제)',
    })
    deletedAt: Date | null;

  }