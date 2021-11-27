import { Test, TestingModule } from '@nestjs/testing';
import { P2pController } from './p2p.controller';

describe('P2pController', () => {
  let controller: P2pController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [P2pController],
    }).compile();

    controller = module.get<P2pController>(P2pController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
