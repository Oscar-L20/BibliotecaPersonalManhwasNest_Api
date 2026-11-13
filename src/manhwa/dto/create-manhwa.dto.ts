import {
  IsArray,
  IsBoolean,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { EstadoObra } from '../entities/manhwa.entity';

export class NotaCapituloDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  capitulo: number;

  @IsOptional()
  @IsString()
  comentario?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(5)
  rating?: number;
}

export class CreateManhwaDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  clienteId: number;

  @IsString()
  @IsNotEmpty({ message: 'El título de la obra es obligatorio' })
  titulo: string;

  @Type(() => Number)
  @IsInt()
  @Min(1, { message: 'Debe tener al menos 1 episodio' })
  episodiosTotales: number;

  @Type(() => Number)
  @IsInt()
  @Min(0, { message: 'El episodio actual no puede ser negativo' })
  episodioActual: number;

  @IsBoolean()
  finalizadoPorLector: boolean;

  @IsOptional()
  @IsBoolean()
  pausadoPorLector?: boolean;

  @IsIn(['En publicación', 'Finalizada', 'Cancelado'], {
    message: 'estadoObra debe ser "En publicación", "Finalizada" o "Cancelado"',
  })
  estadoObra: EstadoObra;

  @IsUrl({}, { message: 'El enlace debe ser una URL válida (ej. https://...)' })
  enlaceWeb: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => NotaCapituloDto)
  notas?: NotaCapituloDto[];
}