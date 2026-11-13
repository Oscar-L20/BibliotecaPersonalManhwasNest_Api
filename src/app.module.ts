import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppService } from './app.service';
import { ClienteModule } from './cliente/cliente.module';
import { ManhwaModule } from './manhwa/manhwa.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      exclude: ['/cliente/{*path}', '/manhwa/{*path}'],
    }),
    ClienteModule,
    ManhwaModule,
  ],
  providers: [AppService],
})
export class AppModule {}