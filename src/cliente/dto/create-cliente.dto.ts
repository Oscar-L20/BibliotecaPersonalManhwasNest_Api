import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateClienteDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  nombre: string;

  @IsString()
  @MinLength(3, { message: 'El apodo debe tener al menos 3 caracteres' })
  apodo: string;

  @IsEmail({}, { message: 'El correo no tiene un formato válido' })
  correo: string;
}