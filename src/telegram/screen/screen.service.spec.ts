import { Test, TestingModule } from '@nestjs/testing';
import { ScreenService } from './screen.service';

describe('ScreenService', () => {
  let service: ScreenService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ScreenService],
    }).compile();

    service = module.get<ScreenService>(ScreenService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
