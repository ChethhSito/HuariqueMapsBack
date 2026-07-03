import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { SuggestionsService } from './suggestions.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

class CreateSuggestionDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  message: string;
}

@ApiTags('suggestions')
@Controller('suggestions')
export class SuggestionsController {
  constructor(private readonly suggestionsService: SuggestionsService) {}

  @Post()
  @ApiOperation({ summary: 'Enviar sugerencia de huarique (público)' })
  @ApiResponse({ status: 201, description: 'Sugerencia recibida' })
  async create(@Body() dto: CreateSuggestionDto) {
    return this.suggestionsService.create(dto.name, dto.email, dto.message);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar todas las sugerencias (Admin)' })
  @ApiResponse({ status: 200, description: 'Lista de sugerencias' })
  @ApiResponse({ status: 403, description: 'Acceso denegado' })
  async findAll() {
    return this.suggestionsService.findAll();
  }
}
