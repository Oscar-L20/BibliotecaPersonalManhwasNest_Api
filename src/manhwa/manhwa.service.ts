import { Injectable, HttpStatus, OnModuleInit } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { CreateManhwaDto, NotaCapituloDto } from './dto/create-manhwa.dto';
import { UpdateManhwaDto } from './dto/update-manhwa.dto';
import { Manhwa } from './entities/manhwa.entity';
import { ManhwaBusinessException } from '../common/exceptions/manhwa-business.exception';

@Injectable()
export class ManhwaService implements OnModuleInit {
  private manhwas: Manhwa[] = [];
  private nextId = 1;
  private readonly dataDir = path.join(process.cwd(), 'data');
  private readonly filePath = path.join(this.dataDir, 'biblioteca.json');

  onModuleInit() {
    this.cargarDesdeDisco();
  }

  private cargarDesdeDisco() {
    try {
      if (!fs.existsSync(this.dataDir)) {
        fs.mkdirSync(this.dataDir, { recursive: true });
      }
      if (fs.existsSync(this.filePath)) {
        const raw = fs.readFileSync(this.filePath, 'utf-8');
        const parsed = JSON.parse(raw);
        this.manhwas = (parsed.manhwas || []).map((m: Manhwa) => ({
          ...m,
          ratingGlobal: this.calcularRatingGlobal(m),
        }));
        this.nextId = parsed.nextId || this.manhwas.length + 1;
      }
    } catch {
      this.manhwas = [];
      this.nextId = 1;
    }
  }

  private guardarEnDisco() {
    if (!fs.existsSync(this.dataDir)) {
      fs.mkdirSync(this.dataDir, { recursive: true });
    }
    fs.writeFileSync(
      this.filePath,
      JSON.stringify({ nextId: this.nextId, manhwas: this.manhwas }, null, 2),
      'utf-8',
    );
  }

  private calcularRatingGlobal(manhwa: Pick<Manhwa, 'notas' | 'episodioActual'>): number {
    const calificadosLeidos = (manhwa.notas || []).filter(
      (n) =>
        n.capitulo <= manhwa.episodioActual &&
        typeof n.rating === 'number' &&
        n.rating >= 1 &&
        n.rating <= 5,
    );

    if (calificadosLeidos.length === 0) return 0;

    const suma = calificadosLeidos.reduce((acc, item) => acc + (item.rating || 0), 0);
    return Number((suma / calificadosLeidos.length).toFixed(2));
  }

  create(createManhwaDto: CreateManhwaDto): Manhwa {
    const tituloNuevo = (createManhwaDto.titulo || '').toLowerCase().trim();
    const duplicado = this.manhwas.find(
      (m) =>
        m.clienteId === createManhwaDto.clienteId &&
        (m.titulo || '').toLowerCase().trim() === tituloNuevo,
    );

    if (duplicado) {
      throw new ManhwaBusinessException(
        `Ya tienes "${createManhwaDto.titulo}" en tu biblioteca.`,
        HttpStatus.CONFLICT,
      );
    }

    const nuevoManhwa: Manhwa = {
      id: this.nextId++,
      ...createManhwaDto,
      pausadoPorLector: createManhwaDto.pausadoPorLector ?? false,
      notas: createManhwaDto.notas || [],
      ratingGlobal: 0,
      fechaAgregado: new Date(),
    };

    nuevoManhwa.ratingGlobal = this.calcularRatingGlobal(nuevoManhwa);

    this.manhwas.push(nuevoManhwa);
    this.guardarEnDisco();
    return nuevoManhwa;
  }

  findAll(): Manhwa[] {
    return this.manhwas;
  }

  findByCliente(clienteId: number): Manhwa[] {
    return this.manhwas.filter((m) => m.clienteId === clienteId);
  }

  findOne(id: number): Manhwa {
    const manhwa = this.manhwas.find((m) => m.id === id);
    if (!manhwa) {
      throw new ManhwaBusinessException(
        `No se encontró el manhwa con ID ${id}`,
        HttpStatus.NOT_FOUND,
      );
    }
    return manhwa;
  }

  update(id: number, updateManhwaDto: UpdateManhwaDto): Manhwa {
    const manhwa = this.findOne(id);

    const nuevoActual =
      updateManhwaDto.episodioActual !== undefined
        ? updateManhwaDto.episodioActual
        : manhwa.episodioActual;

    const nuevoTotal =
      updateManhwaDto.episodiosTotales !== undefined
        ? updateManhwaDto.episodiosTotales
        : manhwa.episodiosTotales;
    
    if (nuevoActual > nuevoTotal) {
      throw new ManhwaBusinessException(
        `El episodio actual (${nuevoActual}) no puede superar el total de episodios (${nuevoTotal}).`,
        HttpStatus.BAD_REQUEST,
      );
    }

    Object.assign(manhwa, updateManhwaDto);

    if (
      manhwa.episodioActual === manhwa.episodiosTotales &&
      manhwa.estadoObra === 'Finalizada'
    ) {
      manhwa.finalizadoPorLector = true;
    }

    manhwa.ratingGlobal = this.calcularRatingGlobal(manhwa);

    this.guardarEnDisco();
    return manhwa;
  }

  upsertNota(id: number, notaDto: NotaCapituloDto): Manhwa {
    const manhwa = this.findOne(id);

    if (notaDto.capitulo > manhwa.episodiosTotales) {
      throw new ManhwaBusinessException(
        `El capítulo ${notaDto.capitulo} no existe; la obra tiene ${manhwa.episodiosTotales} capítulos registrados.`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const comentarioLimpio = notaDto.comentario?.trim() || undefined;
    const ratingValido =
      typeof notaDto.rating === 'number' && notaDto.rating >= 1 && notaDto.rating <= 5
        ? notaDto.rating
        : undefined;

    if (!comentarioLimpio && !ratingValido) {
      throw new ManhwaBusinessException(
        'Debes escribir una nota o seleccionar una calificación (1 a 5) para guardar.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const indexExistente = manhwa.notas.findIndex(
      (n) => n.capitulo === notaDto.capitulo,
    );

    if (indexExistente >= 0) {
      if (comentarioLimpio !== undefined) {
        manhwa.notas[indexExistente].comentario = comentarioLimpio;
      }
      if (ratingValido !== undefined) {
        manhwa.notas[indexExistente].rating = ratingValido;
      }
    } else {
      manhwa.notas.push({
        capitulo: notaDto.capitulo,
        comentario: comentarioLimpio,
        rating: ratingValido,
      });
      manhwa.notas.sort((a, b) => a.capitulo - b.capitulo);
    }

    manhwa.ratingGlobal = this.calcularRatingGlobal(manhwa);

    this.guardarEnDisco();
    return manhwa;
  }
}