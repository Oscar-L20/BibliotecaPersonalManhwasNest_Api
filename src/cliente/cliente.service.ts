import { Injectable, HttpStatus } from '@nestjs/common';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { Cliente } from './entities/cliente.entity';
import { ManhwaBusinessException } from '../common/exceptions/manhwa-business.exception';

@Injectable()
export class ClienteService {
  private clientes: Cliente[] = [
    {
      id: 1,
      nombre: 'Oscar',
      apodo: 'LectorPro',
      correo: 'oscar@ejemplo.com',
      fechaRegistro: new Date(),
    },
  ];
  private nextId = 2;

  create(createClienteDto: CreateClienteDto): Cliente {
    const existe = this.clientes.find(
      (c) => c.correo.toLowerCase() === createClienteDto.correo.toLowerCase(),
    );
    if (existe) {
      throw new ManhwaBusinessException(
        'Ya existe un lector registrado con ese correo.',
        HttpStatus.CONFLICT,
      );
    }

    const nuevoCliente: Cliente = {
      id: this.nextId++,
      ...createClienteDto,
      fechaRegistro: new Date(),
    };
    this.clientes.push(nuevoCliente);
    return nuevoCliente;
  }

  findAll(): Cliente[] {
    return this.clientes;
  }

  findOne(id: number): Cliente {
    const cliente = this.clientes.find((c) => c.id === id);
    if (!cliente) {
      throw new ManhwaBusinessException(
        `No se encontró el cliente con ID ${id}`,
        HttpStatus.NOT_FOUND,
      );
    }
    return cliente;
  }
}
