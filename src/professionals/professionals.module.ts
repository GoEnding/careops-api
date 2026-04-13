import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfessionalProfile } from './entity/professional-profile.entity';
import { ProfessionalsController } from './professionals.controller';
import { ProfessionalsService } from './professionals.service';

@Module({
  imports: [TypeOrmModule.forFeature([ProfessionalProfile])],
  controllers: [ProfessionalsController],
  providers: [ProfessionalsService],
  exports: [TypeOrmModule, ProfessionalsService],
})
export class ProfessionalsModule {}
