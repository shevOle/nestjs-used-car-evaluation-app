import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { UtilsService } from './utils.service';

describe('UtilsService', () => {
  let service: UtilsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UtilsService,
        {
          provide: ConfigService,
          useValue: {
            get: () => 'somesecret',
          },
        },
      ],
    }).compile();

    service = module.get<UtilsService>(UtilsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('password hashing returns a valid hash', async () => {
    const defaultPassword = 'password';
    const hash = await service.hashPassword(defaultPassword);

    expect(hash).toBeDefined();
    expect(hash).not.toBe(defaultPassword);
  });
});
