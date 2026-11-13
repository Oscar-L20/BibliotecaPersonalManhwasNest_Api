import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  HttpStatus,
} from '@nestjs/common';
import { ManhwaBusinessException } from '../exceptions/manhwa-business.exception';

@Injectable()
export class ValidarEpisodiosPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (metadata.type !== 'body' || !value) {
      return value;
    }

    if (
      value.episodioActual !== undefined &&
      value.episodiosTotales !== undefined &&
      Number(value.episodioActual) > Number(value.episodiosTotales)
    ) {
      throw new ManhwaBusinessException(
        `El episodio actual (${value.episodioActual}) no puede ser mayor que los episodios totales (${value.episodiosTotales}).`,
        HttpStatus.BAD_REQUEST,
      );
    }

    return value;
  }
}