import { Test, TestingModule } from '@nestjs/testing';
import { P2pService } from './p2p.service';

describe('P2pService', () => {
  let service: P2pService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [P2pService],
    }).compile();

    service = module.get<P2pService>(P2pService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
