import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { defaultEmail, defaultUser } from '../common/constants/test.constants';

describe('UsersController', () => {
  let controller: UsersController;
  let fakeUserService: Partial<UsersService>;
  const fakeResponse = { sendStatus: jest.fn() } as any;

  beforeEach(async () => {
    fakeUserService = {
      findByEmail: jest.fn((email: string) =>
        Promise.resolve({ ...defaultUser, email }),
      ),
      findAll: jest.fn(() => Promise.resolve(Array(3).fill(defaultUser))),
      findById: jest.fn((id: number) =>
        Promise.resolve({ ...defaultUser, id }),
      ),
      update: jest.fn(),
      remove: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{ provide: UsersService, useValue: fakeUserService }],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('[UsersController], should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findUserds', () => {
    it('email passed, returns one user', async () => {
      const user = await controller.findUsers(defaultEmail);

      expect(user).toBeDefined();
      expect(user).not.toBeInstanceOf(Array);
    });

    it('no email passed, returns couple of users', async () => {
      const users = await controller.findUsers();

      expect(users).toBeDefined();
      expect(users).toBeInstanceOf(Array);
      expect(users).toHaveLength(3);
    });
  });

  describe('findUserById', () => {
    it('Id is not a number, throws an error', async () => {
      const expectedException = new BadRequestException(
        'Id must be a positive number',
      );

      expect(() => controller.findUserById('a')).toThrow(expectedException);
    });

    it('Id is not a positive number, throws an error', async () => {
      const expectedException = new BadRequestException(
        'Id must be a positive number',
      );

      expect(() => controller.findUserById('-2')).toThrow(expectedException);
    });

    it('returns a user', async () => {
      const user = await controller.findUserById('3');

      expect(user).toMatchObject({ ...defaultUser, id: 3 });
    });
  });

  describe('updateUser', () => {
    it('Id is not a number, throws an error', async () => {
      const expectedException = new BadRequestException(
        'Id must be a positive number',
      );

      await expect(
        controller.updateUser('a', {} as any, {} as any),
      ).rejects.toThrow(expectedException);
    });

    it('Id is not a positive number, throws an error', async () => {
      const expectedException = new BadRequestException(
        'Id must be a positive number',
      );

      await expect(
        controller.updateUser('-2', {} as any, fakeResponse),
      ).rejects.toThrow(expectedException);
    });

    it('updates user and returns OK', async () => {
      const update = { email: 'sss@sss.com' };
      await controller.updateUser('1', update, fakeResponse);

      expect(fakeUserService.update).toHaveBeenCalledWith(1, update);
      expect(fakeResponse.sendStatus).toHaveBeenCalledWith(200);
    });

    it('empty update object passed, returns OK', async () => {
      const update = {};
      await controller.updateUser('1', update, fakeResponse);

      expect(fakeUserService.update).toHaveBeenCalledWith(1, update);
      expect(fakeResponse.sendStatus).toHaveBeenCalledWith(200);
    });
  });

  describe('removeUser', () => {
    it('Id is not a number, throws an error', async () => {
      const expectedException = new BadRequestException(
        'Id must be a positive number',
      );

      await expect(controller.removeUser('a', fakeResponse)).rejects.toThrow(
        expectedException,
      );
    });

    it('Id is not a positive number, throws an error', async () => {
      const expectedException = new BadRequestException(
        'Id must be a positive number',
      );

      await expect(controller.removeUser('-2', fakeResponse)).rejects.toThrow(
        expectedException,
      );
    });

    it('removes user and returns NO_CONTENT', async () => {
      await controller.removeUser('1', fakeResponse);

      expect(fakeUserService.remove).toHaveBeenCalledWith(1);
      expect(fakeResponse.sendStatus).toHaveBeenCalledWith(204);
    });
  });
});
