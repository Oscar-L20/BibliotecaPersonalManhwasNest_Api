import { Module } from '@nestjs/common';
import { ManhwaService } from './manhwa.service.js';
import { ManhwaController } from './manhwa.controller.js';

@Module({
  controllers: [ManhwaController],
  providers: [ManhwaService],
})
export class ManhwaModule {}
