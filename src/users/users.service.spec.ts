import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from './users.service';
import { User } from './user.entity';

describe('UsersService', () => {
  let service: UsersService;
  let repository: Repository<User>;

  const defaultEmail = 'email@test.com';
  const defaultPassword = 'password';
  const defaultUserFunc = () => ({ id: 1, email: defaultEmail, password: defaultPassword });

  beforeEach(async () => {
    const fakeUserRepository = {
      findOneBy: jest.fn(({ id }) => Promise.resolve({ ...defaultUserFunc(), id })),
      findOne: jest.fn(({ where: { email } }) => Promise.resolve({ ...defaultUserFunc(), email })),
      create: jest.fn((({ email, password }) => Promise.resolve({ id: 1, email, password }))),
      save: jest.fn(user => Promise.resolve(user)),
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

  it('[findById], invalid number as Id passed, returns null', async () => {
    const user = await service.findById(NaN);
    expect(user).toBeNull();
  })

  it('[findById], user is not found, throws an error', async () => {
    repository.findOneBy = jest.fn().mockResolvedValueOnce(null);
    const expectedException = new NotFoundException('User not found');

    await expect(service.findById(1)).rejects.toThrow(expectedException);
  })

  it('[findById], user returned', async () => {
    const user = await service.findById(1);

    expect(user).toBeDefined();
    expect(user.email).toBe(defaultEmail);
    expect(user.password).toBe(defaultPassword);
    expect(user.id).toBe(1);
  })

  it('[findByEmail], email is empty string, returns null', async () => {
    const user = await service.findByEmail('');

    expect(user).toBeNull();
  })

  it('[findByEmail], valid email passed, returns user', async () => {
    const user = await service.findByEmail(defaultEmail);

    expect(user).toBeDefined();
    expect(user.email).toBe(defaultEmail);
    expect(user.password).toBe(defaultPassword);
    expect(user.id).toBe(1);
  })

  it('[findAll], returns couple of users', async () => {
    repository.find = jest.fn().mockResolvedValueOnce(Array(3).map(defaultUserFunc));
    const users = await service.findAll();

    expect(users).toHaveLength(3);
  })

  it('[createUser], provided email is in use, throws an error', async () => {
    const expectedException = new BadRequestException('User with this email already exists');

    await expect(service.createUser(defaultEmail, defaultPassword)).rejects.toThrow(expectedException);
  })

  it('[createUser], saves and returns user', async () => {
    repository.findOne = jest.fn().mockResolvedValueOnce(null);
    const user = await service.createUser(defaultEmail, defaultPassword);

    expect(user).toBeDefined();
    expect(user.email).toBe(defaultEmail);
    expect(user.password).toBe(defaultPassword);
    expect(user.id).toBe(1);
  })

  it('[update], passed invalid number as an Id, throws an error', async () => {
    const expectedException = new BadRequestException('User Id is needed');

    await expect(service.update(NaN, { email: defaultEmail })).rejects.toThrow(expectedException);
  })

  it('[update], returns updated user', async () => {
    const defaultUser = defaultUserFunc();
    repository.create = jest.fn().mockImplementationOnce((update) => Promise.resolve({ ...defaultUser, ...update }));
    const userUpdate = { email: 'newEmail@test.com' };

    const user = await service.update(1, userUpdate);

    expect(user).toBeDefined();
    expect(user.id).toBe(defaultUser.id);
    expect(user.email).toBe(userUpdate.email);
    expect(user.password).toBe(defaultUser.password);
  })

  it('[remove], passed invalid number as an Id, throws an error', async () => {
    const expectedException = new BadRequestException('User Id is needed');

    await expect(service.remove(NaN)).rejects.toThrow(expectedException);
  })

  it('[remove], returns removed user', async () => {
    const user = await service.remove(13);
    console.log(user)

    expect(user).toBeDefined();
    expect(user.id).toBe(13);
  })
});
