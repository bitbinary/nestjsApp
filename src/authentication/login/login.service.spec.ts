import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule, ConfigService } from '@nestjs/config';

import {
  FAKEUSER,
  INCORRECT_USERIDENTIFIER,
  LOGIN_SUCCESS_RESPONSE,
  USERIDENTIFIER,
} from './../../../test/constants/authentication';
import { TokenModule } from './../token/token.module';
import { UserService } from '../../database/user/user.service';
import { LoginService } from './login.service';
import { tokenConfig } from '../../constants/TokenConfig';

let fakeUser = {
  ...FAKEUSER,
};

const MockjwtService = {
  sign: jest.fn().mockImplementation(() => {
    return 'token';
  }),
};
const MockUserService = {
  findUser: jest.fn(async (identifier) => {
    if (identifier.username === fakeUser.username) return fakeUser;
    else return null;
  }),
  updateUserData: jest.fn(async (identifier, updates) => {
    if (identifier.username === fakeUser.username)
      return { ...fakeUser, ...updates };
  }),
};
describe('LoginService', () => {
  let service: LoginService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TokenModule,
        ConfigModule.forRoot({ isGlobal: true, load: [tokenConfig] }),
      ],
      providers: [LoginService, UserService, ConfigService, JwtService],
    })
      .overrideProvider(UserService)
      .useValue(MockUserService)
      .overrideProvider(JwtService)
      .useValue(MockjwtService)

      .compile();

    service = module.get<LoginService>(LoginService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should check user exist', async () => {
    expect(await service.checkUserExist(USERIDENTIFIER)).toEqual(fakeUser);
  });
  it('should check user not exist', async () => {
    expect(await service.checkUserExist(INCORRECT_USERIDENTIFIER)).toEqual(
      null,
    );
  });
  it('should check user account locked', async () => {
    const currentTime = new Date();
    const expiryTime = addMinutes(new Date(), 5);
    expect(await service.checkIsLocked(currentTime, expiryTime)).toEqual(true);
  });
  it('should check user account not locked', async () => {
    const currentTime = new Date();
    const expiryTime = addMinutes(new Date(), 0);
    expect(await service.checkIsLocked(currentTime, expiryTime)).toEqual(false);
  });
  it('should identify correct Credentials', async () => {
    expect(await service.validateCredentials(USERIDENTIFIER)).toEqual(true);
  });
  it('should identify incorrect Credentials', async () => {
    expect(await service.validateCredentials(INCORRECT_USERIDENTIFIER)).toEqual(
      false,
    );
  });

  it('should update Failed Attempt', async () => {
    fakeUser = {
      ...FAKEUSER,
    };
    expect(await service.updateFailedAttempt(USERIDENTIFIER)).toEqual({
      ...fakeUser,
      lockAttemptCount: fakeUser.lockAttemptCount + 1,
    });
  });

  it('should update Failed Attempt  and expiry', async () => {
    fakeUser = {
      ...FAKEUSER,
      lockAttemptCount: 2,
    };
    expect(await service.updateFailedAttempt(USERIDENTIFIER)).toEqual({
      ...fakeUser,
      lockAttemptCount: 0,
      lockExpiry: expect.any(Date),
    });
  });
  it('should create post successfull login response', async () => {
    expect(await service.postSuccesfullLogin(USERIDENTIFIER)).toEqual(
      LOGIN_SUCCESS_RESPONSE,
    );
  });
});

// Function to add minutes to a date
function addMinutes(date, minutes) {
  return new Date(date.getTime() + minutes * 60000);
}
