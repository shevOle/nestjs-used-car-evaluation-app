import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { UtilsService } from '../utils/utils.service';
import {
  defaultEmail,
  defaultPassword,
  randomHashedPassword,
  defaultUser,
} from '../common/constants/test.constants';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUserService: Partial<UsersService>;
  let fakeUtilsService: Partial<UtilsService>;

  beforeEach(async () => {
    fakeUserService = {
      findByEmail: async (email: string) => ({
        ...defaultUser,
        email,
      }),
      createUser: async (email: string, password: string) => ({
        ...defaultUser,
        email,
        password,
      }),
    };

    fakeUtilsService = {
      hashPassword: jest.fn(async () => randomHashedPassword),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUserService,
        },
        {
          provide: UtilsService,
          useValue: fakeUtilsService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('[AuthService], should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('signup', () => {
    it('email is already registered, throws an error', async () => {
      const expectedException = new BadRequestException(
        'This email is already in use',
      );
      await expect(
        service.singup(defaultEmail, defaultPassword),
      ).rejects.toThrow(expectedException);
    });

    it('user is created and returned', async () => {
      fakeUserService.findByEmail = async (email: string) => null;
      const user = await service.singup(defaultEmail, defaultPassword);

      expect(user).toBeDefined();
      expect(user.email).toBe(defaultEmail);
    });
  });

  describe('login', () => {
    it('email is not correct, throws an error', async () => {
      fakeUserService.findByEmail = async (email: string) => null;
      const email = 'incorrect-email@test.com';
      const expectedException = new BadRequestException(
        'Username or password is incorrect',
      );
      await expect(service.login(email, defaultPassword)).rejects.toThrow(
        expectedException,
      );
    });

    it('password is not correct, throws an error', async () => {
      const expectedException = new BadRequestException(
        'Username or password is incorrect',
      );
      await expect(
        service.login(defaultEmail, 'incorrectpassword'),
      ).rejects.toThrow(expectedException);
    });

    it('data is correct, return a user', async () => {
      fakeUserService.findByEmail = async (email: string) => ({
        ...defaultUser,
        email,
        password: randomHashedPassword,
      });

      const user = await service.login(defaultEmail, defaultPassword);

      expect(user).toBeDefined();
      expect(user.email).toBe(defaultEmail);
    });
  });
});
