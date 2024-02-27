import { InternalServerErrorException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let fakeAuthService: Partial<AuthService>;
  
  const defaultEmail = 'email@test.com';
  const defaultPassword = 'password';

  beforeEach(async () => {
    fakeAuthService = {
      singup: async (email: string, password: string) => ({ id: 1, email, password}),
      login: async (email: string, password: string) => ({ id: 1, email, password}),
    }

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: fakeAuthService,
        }
      ]
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('[AuthController], should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('signupUser', () => {
    it('something went wrong, throws an error', async () => {
      fakeAuthService.singup = (email: string, password: string) => Promise.reject('some reason');
      const requestBody = { email: defaultEmail, password: defaultPassword };
      const expectedException = new InternalServerErrorException('Something went wrong');
  
      await expect(controller.signupUser(requestBody, {} as any, {})).rejects.toThrow(expectedException);
    })
  
    it('creates user and returns CREATED', async () => {
      const responseObjectMock = {
        sendStatus: jest.fn()
      }
      const requestBody = { email: defaultEmail, password: defaultPassword };
      const session = { userId: 3333 };
  
      await controller.signupUser(requestBody, responseObjectMock as any, session);
  
      expect(session.userId).toBe(1);
      expect(responseObjectMock.sendStatus).toHaveBeenCalledWith(201);
    })
  })


  describe('loginUser', () => {
    it('logs user in and returns OK', async () => {
      const responseObjectMock = {
        sendStatus: jest.fn()
      }
      const requestBody = { email: defaultEmail, password: defaultPassword };
      const session = { userId: 3333 };
  
      await controller.loginUser(requestBody, responseObjectMock as any, session);
  
      expect(session.userId).toBe(1);
      expect(responseObjectMock.sendStatus).toHaveBeenCalledWith(200);
    })
  })

  describe('logOut', () => {
    it('removes userId from session object', () => {
      const responseObjectMock = {
        sendStatus: jest.fn()
      }
      const session = { userId: 3333 };

      controller.logOut(session, responseObjectMock as any);
      expect(session.userId).toBeNull();
    })
  })
});
