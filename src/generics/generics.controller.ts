import { Body, Controller, Get, Logger, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GetGenericsDto } from './dtos/GetGenerics.dto';
import { GenericsService } from './generics.service';

@ApiTags('generics')
@Controller('generics')
export class GenericsController {
  private logger = new Logger(GenericsController.name);

  constructor(private readonly genericsService: GenericsService) { }

  @Post()
  getGenerics(@Body() dto: GetGenericsDto) {
    this.logger.log('getGenerics');
    this.logger.debug(dto)

    return dto;
  }
}
