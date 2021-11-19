import { LoginBody } from './../../interfaces/Login.interface';
import { Injectable } from '@nestjs/common';
import { UserService } from 'src/database/user/user.service';

import * as moment from 'moment';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class LoginService {
  constructor(private userService: UserService) {}

  async checkUserExist(identifier) {
    return await this.userService.findUser(identifier);
  }

  async checkIsLocked(currentTime, lockExpiry) {
    return moment(moment(lockExpiry)).isAfter(currentTime);
  }

  async validateCredentials(credentials: LoginBody, password: string) {
    return credentials.password === password;
  }

  async updateFailedAttempt(identifier) {
    const lockTimeInMinutes = 5;
    const user = await this.userService.findUser(identifier);
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
    await this.userService.updateUserData(identifier, userDetailsUpdates);
  }

  async postSuccesfullLogin(identifier) {
    let userDetailsUpdates = {};
    const token = jwt.sign(
      { ...identifier },
      process.env.TOKEN_SECRET as string,
      {
        expiresIn: '3000s',
      },
    );
    userDetailsUpdates = { lockAttemptCount: 0, token };

    await this.userService.updateUserData(identifier, userDetailsUpdates);
    return token;
  }
}
