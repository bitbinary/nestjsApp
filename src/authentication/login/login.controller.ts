import { LoginService } from './login.service';
import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { LoginBody } from 'src/interfaces/Login.interface';

const LOGIN_SUCCESS_RESPONSE = {
  success: true,
  token: null,
};

const LOGIN_FAILED_RESPONSE = {
  success: false,
  message: 'Login Failed',
};
@Controller('login')
export class LoginController {
  constructor(private loginService: LoginService) {}
  @Post('')
  @HttpCode(200)
  async doLogin(@Body() credentials: LoginBody) {
    try {
      const reqTime = new Date();
      const user = await this.loginService.checkUserExist({
        username: credentials.username,
      });
      if (!user) throw LOGIN_FAILED_RESPONSE;
      const isLocked = await this.loginService.checkIsLocked(
        reqTime,
        user.lockExpiry,
      );
      if (isLocked) throw LOGIN_FAILED_RESPONSE;
      const isValidCredentials = await this.loginService.validateCredentials(
        credentials,
      );
      if (!isValidCredentials) {
        await this.loginService.updateFailedAttempt({
          username: credentials.username,
        });
        throw LOGIN_FAILED_RESPONSE;
      } else {
        const response = await this.loginService.postSuccesfullLogin({
          username: credentials.username,
        });
        return { ...LOGIN_SUCCESS_RESPONSE, ...response };
      }
    } catch (error) {
      return error;
    }
  }
}
