import { Test, TestingModule } from '@nestjs/testing';
import { LoginService } from './login.service';
import { LoginController } from './login.controller';
import {
  LOGIN_SUCCESS_RESPONSE,
  FAKEUSER,
  INCORRECT_USERIDENTIFIER,
  USERIDENTIFIER,
  LOGIN_FAILURE_RESPONSE,
} from './../../../test/constants/authentication';

class LoginServiceMock {
  user = FAKEUSER;
  checkUserExist = jest.fn(
    (identifier) => identifier.username === this.user.username,
  );
  checkIsLocked = jest.fn(() => false);
  validateCredentials = jest.fn(
    (identifier) => identifier.username === this.user.username,
  );
  updateFailedAttempt = jest.fn(
    (identifier) => identifier.username === this.user.username,
  );
  postSuccesfullLogin = jest.fn(() => ({
    success: true,
    token: 'token',
  }));
}

describe('LoginController', () => {
  let service: LoginController;
  let loginService: LoginServiceMock;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LoginController],
      providers: [
        {
          provide: LoginService,
          useClass: LoginServiceMock,
        },
      ],
    }).compile();

    service = module.get(LoginController);
    loginService = module.get(LoginService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('login user with correct details', () => {
    it('should login', async () => {
      expect(await service.doLogin(USERIDENTIFIER)).toEqual(
        LOGIN_SUCCESS_RESPONSE,
      );
      expect(loginService.checkUserExist).toBeCalledTimes(1);
      expect(loginService.checkIsLocked).toBeCalledTimes(1);
      expect(loginService.validateCredentials).toBeCalledTimes(1);
      expect(loginService.postSuccesfullLogin).toBeCalledTimes(1);
    });
  });
  describe('login user with incorrect details - User does not exist', () => {
    it('should not login', async () => {
      expect(await service.doLogin(INCORRECT_USERIDENTIFIER)).toEqual(
        LOGIN_FAILURE_RESPONSE,
      );
      expect(loginService.checkUserExist).toBeCalledTimes(1);
      expect(loginService.checkIsLocked).toBeCalledTimes(0);
      expect(loginService.validateCredentials).toBeCalledTimes(0);
      expect(loginService.postSuccesfullLogin).toBeCalledTimes(0);
    });
  });
});
