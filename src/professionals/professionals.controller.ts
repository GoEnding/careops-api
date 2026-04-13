import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ProfessionalsService } from './professionals.service';

@ApiTags('professionals')
@Controller('professionals')
export class ProfessionalsController {
  constructor(private readonly professionalsService: ProfessionalsService) {}
}
