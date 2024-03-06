import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from './users.service';
import { User } from '../db/entities/user.entity';
import {
  defaultEmail,
  defaultPassword,
  defaultUser,
} from '../common/constants/test.constants';

describe('UsersService', () => {
  let service: UsersService;
  let repository: Repository<User>;

  beforeEach(async () => {
    const fakeUserRepository = {
      findOneBy: jest.fn(({ id }) => Promise.resolve({ ...defaultUser, id })),
      findOne: jest.fn(({ where: { email } }) =>
        Promise.resolve({ ...defaultUser, email }),
      ),
      create: jest.fn(({ email, password }) =>
        Promise.resolve({ ...defaultUser, email, password }),
      ),
      save: jest.fn((user) => Promise.resolve(user)),
      remove: jest.fn((user) => Promise.resolve(user)),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: fakeUserRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get(getRepositoryToken(User));
  });

  it('[UserService], should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findById', () => {
    it('invalid number as Id passed, returns null', async () => {
      const user = await service.findById(NaN);
      expect(user).toBeNull();
    });

    it('user is not found, throws an error', async () => {
      repository.findOneBy = jest.fn().mockResolvedValueOnce(null);
      const expectedException = new NotFoundException('User not found');

      await expect(service.findById(1)).rejects.toThrow(expectedException);
    });

    it('user returned', async () => {
      const user = await service.findById(1);

      expect(user).toBeDefined();
      expect(user.email).toBe(defaultEmail);
      expect(user.password).toBe(defaultPassword);
      expect(user.id).toBe(1);
    });
  });

  describe('findByEmail', () => {
    it('email is empty string, returns null', async () => {
      const user = await service.findByEmail('');

      expect(user).toBeNull();
    });

    it('valid email passed, returns user', async () => {
      const user = await service.findByEmail(defaultEmail);

      expect(user).toBeDefined();
      expect(user.email).toBe(defaultEmail);
      expect(user.password).toBe(defaultPassword);
      expect(user.id).toBe(1);
    });
  });

  describe('findAll', () => {
    it('returns couple of users', async () => {
      repository.find = jest
        .fn()
        .mockResolvedValueOnce(Array(3).fill(defaultUser));
      const users = await service.findAll();

      expect(users).toHaveLength(3);
    });
  });

  describe('createUser', () => {
    it('provided email is in use, throws an error', async () => {
      const expectedException = new BadRequestException(
        'User with this email already exists',
      );

      await expect(
        service.createUser(defaultEmail, defaultPassword),
      ).rejects.toThrow(expectedException);
    });

    it('saves and returns user', async () => {
      repository.findOne = jest.fn().mockResolvedValueOnce(null);
      const user = await service.createUser(defaultEmail, defaultPassword);

      expect(user).toBeDefined();
      expect(user.email).toBe(defaultEmail);
      expect(user.password).toBe(defaultPassword);
      expect(user.id).toBe(1);
    });
  });

  describe('update', () => {
    it('passed invalid number as an Id, throws an error', async () => {
      const expectedException = new BadRequestException('User Id is needed');

      await expect(
        service.update(NaN, { email: defaultEmail }),
      ).rejects.toThrow(expectedException);
    });

    it('returns updated user', async () => {
      repository.create = jest
        .fn()
        .mockImplementationOnce((update) =>
          Promise.resolve({ ...defaultUser, ...update }),
        );
      const userUpdate = { email: 'newEmail@test.com' };

      const user = await service.update(1, userUpdate);

      expect(user).toBeDefined();
      expect(user.id).toBe(defaultUser.id);
      expect(user.email).toBe(userUpdate.email);
      expect(user.password).toBe(defaultUser.password);
    });
  });

  describe('remove', () => {
    it('passed invalid number as an Id, throws an error', async () => {
      const expectedException = new BadRequestException('User Id is needed');

      await expect(service.remove(NaN)).rejects.toThrow(expectedException);
    });

    it('returns removed user', async () => {
      const user = await service.remove(13);

      expect(user).toBeDefined();
      expect(user.id).toBe(13);
    });
  });
});
