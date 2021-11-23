import { LoginBody } from './../../interfaces/Login.interface';
import { Injectable } from '@nestjs/common';
import { UserService } from '../../database/user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as moment from 'moment';
import { UserIdentifier } from 'src/interfaces/User.interface';

@Injectable()
export class LoginService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async checkUserExist(identifier: UserIdentifier) {
    return await this.userService.findUser(identifier);
  }

  async checkIsLocked(currentTime, lockExpiry) {
    return moment(moment(lockExpiry)).isAfter(currentTime);
  }

  async validateCredentials(credentials: LoginBody) {
    const { username, password } = credentials;
    const identifier = { username, password };
    return !!(await this.userService.findUser(identifier));
  }

  async updateFailedAttempt(identifier: UserIdentifier) {
    const lockTimeInMinutes = 5;
    const user = await this.userService.findUser(identifier);
    if (!user) return null;
    let userDetailsUpdates = {};
    if (user.lockAttemptCount === 2) {
      const newExpiryTime = moment()
        .add(lockTimeInMinutes, 'minutes')
        .toISOString();
      userDetailsUpdates = {
        lockExpiry: new Date(newExpiryTime),
        lockAttemptCount: 0,
      };
    } else {
      userDetailsUpdates = {
        lockAttemptCount: user.lockAttemptCount + 1,
      };
    }
    return await this.userService.updateUserData(
      identifier,
      userDetailsUpdates,
    );
  }

  async postSuccesfullLogin(identifier: UserIdentifier) {
    let userDetailsUpdates = {};
    const token = this.jwtService.sign({ ...identifier });
    userDetailsUpdates = { lockAttemptCount: 0, token };

    await this.userService.updateUserData(identifier, userDetailsUpdates);
    return { token, success: true };
  }
}
