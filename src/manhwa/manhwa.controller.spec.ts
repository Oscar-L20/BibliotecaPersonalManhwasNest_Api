import { Test, TestingModule } from '@nestjs/testing';
import { ManhwaController } from './manhwa.controller.js';
import { ManhwaService } from './manhwa.service.js';

describe('ManhwaController', () => {
  let controller: ManhwaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ManhwaController],
      providers: [ManhwaService],
    }).compile();

    controller = module.get<ManhwaController>(ManhwaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
