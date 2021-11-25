import { LoginService } from './login.service';
import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { LoginBody } from 'src/interfaces/Login.interface';

// Initialising the base structure of a successful response
const LOGIN_SUCCESS_RESPONSE = {
  success: true,
  token: null,
};

// Initialising the base structure of a failed response
const LOGIN_FAILED_RESPONSE = {
  success: false,
  message: 'Login Failed',
};
@Controller('login')
export class LoginController {
  constructor(private loginService: LoginService) {}
  // Recieves the post requet to the login controller
  @Post('')
  @HttpCode(200) // sets the default response as 200 overriding 201
  async doLogin(@Body() credentials: LoginBody) {
    // Invokes the main login function
    try {
      const reqTime = new Date(); // Timestamp used to identify the request received time

      // Checks if the requested user exists in the db before moving forward, If not exist, respond with failure
      const user = await this.loginService.checkUserExist({
        username: credentials.username,
      });
      if (!user) throw LOGIN_FAILED_RESPONSE;

      // Check if the requested user account is locked, typically due to three failed attemps. If locked, respond with failure
      const isLocked = await this.loginService.checkIsLocked(
        reqTime,
        user.lockExpiry,
      );
      if (isLocked) throw LOGIN_FAILED_RESPONSE;

      //Validating if the provided credentials matches.
      const isValidCredentials = await this.loginService.validateCredentials(
        credentials,
      );
      // If the provided credentials are not matching, update the user record attempt count and lock if required, then respond with failure
      if (!isValidCredentials) {
        await this.loginService.updateFailedAttempt({
          username: credentials.username,
        });
        throw LOGIN_FAILED_RESPONSE;
      } else {
        // if the user login was successfull, reset the attempts count and provide a token for the user
        const response = await this.loginService.postSuccesfullLogin({
          username: credentials.username,
        });
        return { ...LOGIN_SUCCESS_RESPONSE, ...response };
      }
    } catch (error) {
      // Catch errors if any and respond with the error
      return error;
    }
  }
}
