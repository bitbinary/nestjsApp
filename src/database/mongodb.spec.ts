import { Test, TestingModule } from '@nestjs/testing';
import { Mongodb } from './mongodb';

describe('Mongodb', () => {
  let provider: Mongodb;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Mongodb],
    }).compile();

    provider = module.get<Mongodb>(Mongodb);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
