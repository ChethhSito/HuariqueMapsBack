import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { HuariquesService } from './huariques.service';
import { CreateHuariqueDto } from './dto/create-huarique.dto';

@Controller('huariques')
export class HuariquesController {
  constructor(private readonly huariquesService: HuariquesService) {}

  @Post()
  async create(@Body() createHuariqueDto: CreateHuariqueDto) {
    return this.huariquesService.create(createHuariqueDto);
  }

  @Get()
  async findAll() {
    return this.huariquesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.huariquesService.findOne(id);
  }
}
