import { LoginBody } from './../../interfaces/Login.interface';
import { Injectable } from '@nestjs/common';
import { UserService } from '../../database/user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as moment from 'moment';
import { UserIdentifier } from 'src/interfaces/User.interface';

@Injectable()
export class LoginService {
  constructor(
    private userService: UserService, //service for handling user data manipulation
    private jwtService: JwtService, //service for handling token
  ) {}

  // Function that checks if the provided user is in the database
  async checkUserExist(identifier: UserIdentifier) {
    return await this.userService.findUser(identifier);
  }

  //Checks if the provided time is after the expiry time
  async checkIsLocked(currentTime, lockExpiry) {
    return moment(moment(lockExpiry)).isAfter(currentTime);
  }

  // Checks if the provided userdetails matches to a user.
  async validateCredentials(credentials: LoginBody) {
    const { username, password } = credentials;
    const identifier = { username, password };
    return !!(await this.userService.findUser(identifier));
  }

  // updates the user detials following a failed attempt
  async updateFailedAttempt(identifier: UserIdentifier) {
    const lockTimeInMinutes = 5; // lock state time in minutes
    // Finds the user to lock
    const user = await this.userService.findUser(identifier);
    // if the user does not exist, do nothing
    if (!user) return null;
    // Initialising the object to store the new details to update based on the criteria.
    let userDetailsUpdates = {};
    if (user.lockAttemptCount === 2) {
      // Lock condition achieved. Need to lock the account for 5 mins. Setting the lock expiry to 5 mins from current time
      const newExpiryTime = moment()
        .add(lockTimeInMinutes, 'minutes')
        .toISOString();
      // Setting the details to update and Resetting the lock attempt count.
      userDetailsUpdates = {
        lockExpiry: new Date(newExpiryTime),
        lockAttemptCount: 0,
      };
    } else {
      // lock condition not acieved. So just increment the attempt
      userDetailsUpdates = {
        lockAttemptCount: user.lockAttemptCount + 1,
      };
    }
    // Making the changes and commiting
    return await this.userService.updateUserData(
      identifier,
      userDetailsUpdates,
    );
  }

  // Handles the process after a successfull login
  async postSuccesfullLogin(identifier: UserIdentifier) {
    // Initialis the object for the updates to make
    let userDetailsUpdates = {};
    // Generating a token for the provided user
    const token = this.jwtService.sign({ ...identifier });
    // resetting the token and updating the token
    userDetailsUpdates = { lockAttemptCount: 0, token };
    // Commiting the changes to the database
    await this.userService.updateUserData(identifier, userDetailsUpdates);
    // Provide the response for the user after successful login
    return { token, success: true };
  }
}
