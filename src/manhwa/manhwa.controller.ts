import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { ManhwaService } from './manhwa.service';
import { CreateManhwaDto, NotaCapituloDto } from './dto/create-manhwa.dto';
import { UpdateManhwaDto } from './dto/update-manhwa.dto';
import { ApiKeyGuard } from '../common/guards/api-key.guard';
import { TransformResponseInterceptor } from '../common/interceptors/transform-response.interceptor';
import { ValidarEpisodiosPipe } from '../common/pipes/validar-episodios.pipe';

@UseInterceptors(TransformResponseInterceptor)
@Controller('manhwa')
export class ManhwaController {
  constructor(private readonly manhwaService: ManhwaService) {}

  @Post()
  @UseGuards(ApiKeyGuard)
  @UsePipes(ValidarEpisodiosPipe)
  create(@Body() createManhwaDto: CreateManhwaDto) {
    return this.manhwaService.create(createManhwaDto);
  }

  @Get()
  findAll() {
    return this.manhwaService.findAll();
  }

  @Get('cliente/:clienteId')
  findByCliente(@Param('clienteId', ParseIntPipe) clienteId: number) {
    return this.manhwaService.findByCliente(clienteId);
  }

  @Patch(':id')
  @UseGuards(ApiKeyGuard)
  @UsePipes(ValidarEpisodiosPipe)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateManhwaDto: UpdateManhwaDto,
  ) {
    return this.manhwaService.update(id, updateManhwaDto);
  }

  @Post(':id/notas')
  @UseGuards(ApiKeyGuard)
  upsertNota(
    @Param('id', ParseIntPipe) id: number,
    @Body() notaDto: NotaCapituloDto,
  ) {
    return this.manhwaService.upsertNota(id, notaDto);
  }
}