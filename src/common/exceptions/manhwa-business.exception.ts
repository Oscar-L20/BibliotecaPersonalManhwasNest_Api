import { HttpException, HttpStatus } from '@nestjs/common';

export class ManhwaBusinessException extends HttpException {
  constructor(mensaje: string, status: HttpStatus = HttpStatus.BAD_REQUEST) {
    super(
      {
        statusCode: status,
        error: 'Error de Regla de Negocio en Biblioteca Manhwa',
        message: mensaje,
      },
      status,
    );
  }
}