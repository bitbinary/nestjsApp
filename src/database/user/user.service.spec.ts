import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { User } from '../../schemas/user.schema';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;
  const TEST_USER_DATA = { username: 'test', token: 'token' };
  const TEST_USER_UPDATES = { token: 'new token' };
  const TEST_IDENTIFIER = { username: 'test' };
  class UserDocumentMock {
    user;
    userTemp;
    constructor() {
      this.user = { ...TEST_USER_DATA };
      this.userTemp = { ...TEST_USER_DATA };
    }
    set(testUpdates) {
      this.userTemp = { ...this.userTemp, ...testUpdates };
    }
    save() {
      this.user = { ...this.userTemp };
    }
    getUser() {
      return this.user;
    }
  }
  class UserModelMock {
    userDoc = new UserDocumentMock();

    async findOne({ username }) {
      if (username === this.userDoc.getUser().username) return this.userDoc;
      return null;
    }

    async updateUserData({ username }, newDetails) {
      if (username !== this.userDoc.getUser().username) return null;
      this.userDoc.set(newDetails);
      return this.userDoc.save();
    }
  }
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserService],
      providers: [
        {
          provide: getModelToken(User.name),
          useClass: UserModelMock,
        },
      ],
    }).compile();

    service = module.get(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findUser', () => {
    it('should', async () => {
      expect(await service.findUser(TEST_IDENTIFIER)).toEqual(
        new UserDocumentMock(),
      );
    });
  });

  describe('updateUserData', () => {
    it('should', async () => {
      expect(await service.updateUserData(TEST_IDENTIFIER, TEST_USER_UPDATES));
    });
  });
});
