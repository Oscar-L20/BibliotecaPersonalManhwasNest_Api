import {
  IsBoolean,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  Min,
} from 'class-validator';
import { EstadoObra } from '../entities/manhwa.entity';

export class UpdateManhwaDto {
  @IsOptional()
  @IsString()
  titulo?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  episodiosTotales?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  episodioActual?: number;

  @IsOptional()
  @IsBoolean()
  finalizadoPorLector?: boolean;

  @IsOptional()
  @IsBoolean()
  pausadoPorLector?: boolean;

  @IsOptional()
  @IsIn(['En publicación', 'Finalizada', 'Cancelado'])
  estadoObra?: EstadoObra;

  @IsOptional()
  @IsUrl()
  enlaceWeb?: string;
}