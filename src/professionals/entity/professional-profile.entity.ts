import {
    Column,
    CreateDateColumn,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
  } from 'typeorm';
  import { User } from '../../users/entity/user.entity';
  import { ProfessionalType } from '../../common/enums/professional-type.enum';
  import { ProfessionalVerificationTrack } from '../../common/enums/professional-verification-track.enum';
  import { ProfessionalStatus } from '../../common/enums/professional-status.enum';
  
  @Entity('professional_profiles')
  @Index('uq_professional_profiles_user_id', ['userId'], { unique: true })
  export class ProfessionalProfile {
    @PrimaryGeneratedColumn({ unsigned: true })
    id: number;
  
    @Column({
      name: 'user_id',
      type: 'int',
      unsigned: true,
      nullable: false,
      comment: 'users.id FK',
    })
    userId: number;
  
    @OneToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    user: User;
  
    @Column({
      name: 'professional_type',
      type: 'enum',
      enum: ProfessionalType,
      nullable: false,
      comment: '전문가 기본 직군',
    })
    professionalType: ProfessionalType;
  
    @Column({
      name: 'verification_track',
      type: 'enum',
      enum: ProfessionalVerificationTrack,
      nullable: false,
      comment: '전문가 검증 경로',
    })
    verificationTrack: ProfessionalVerificationTrack;
  
    @Column({
      name: 'professional_status',
      type: 'enum',
      enum: ProfessionalStatus,
      default: ProfessionalStatus.PENDING,
      nullable: false,
      comment: '전문가 승인 상태',
    })
    professionalStatus: ProfessionalStatus;
  
    @Column({
      name: 'specialty',
      type: 'varchar',
      length: 100,
      nullable: true,
      default: null,
      comment: '전문 분야',
    })
    specialty: string | null;
  
    @Column({
      name: 'org_name',
      type: 'varchar',
      length: 100,
      nullable: true,
      default: null,
      comment: '소속 기관명',
    })
    orgName: string | null;
  
    @Column({
      name: 'license_number',
      type: 'varchar',
      length: 50,
      nullable: true,
      default: null,
      comment: '면허/자격 번호',
    })
    licenseNumber: string | null;
  
    @Column({
      name: 'sub_qualification',
      type: 'varchar',
      length: 100,
      nullable: true,
      default: null,
      comment: '세부 전문 자격명',
    })
    subQualification: string | null;
  
    @Column({
      name: 'work_email',
      type: 'varchar',
      length: 100,
      nullable: true,
      default: null,
      comment: '재직 이메일',
    })
    workEmail: string | null;
  
    @Column({
      name: 'job_title',
      type: 'varchar',
      length: 50,
      nullable: true,
      default: null,
      comment: '직무/직책명',
    })
    jobTitle: string | null;
  
    @Column({
      name: 'introduction',
      type: 'text',
      nullable: true,
      default: null,
      comment: '전문가 소개',
    })
    introduction: string | null;
  
    @Column({
      name: 'verified_at',
      type: 'datetime',
      nullable: true,
      default: null,
      comment: '전문가 검증 완료 일시',
    })
    verifiedAt: Date | null;
  
    @Column({
      name: 'approved_by',
      type: 'int',
      unsigned: true,
      nullable: true,
      default: null,
      comment: '승인 관리자 users.id',
    })
    approvedBy: number | null;
  
    @ManyToOne(() => User, { nullable: true })
    @JoinColumn({ name: 'approved_by' })
    approvedByUser: User | null;
  
    @Column({
      name: 'rejection_reason',
      type: 'varchar',
      length: 255,
      nullable: true,
      default: null,
      comment: '반려 사유',
    })
    rejectionReason: string | null;
  
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
  }