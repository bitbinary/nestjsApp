import { LoginService } from './login.service';
import {
  Body,
  ConsoleLogger,
  Controller,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginBody } from 'src/interfaces/Login.interface';
import { NotFoundError } from 'rxjs';

@Controller('login')
export class LoginController {
  constructor(private loginService: LoginService) {}
  log = new ConsoleLogger();
  @Post('')
  async doLogin(@Body() credentials: LoginBody) {
    try {
      const reqTime = new Date();
      const user = await this.loginService.checkUserExist({
        username: credentials.username,
      });
      if (!user) throw UnauthorizedException;
      const isLocked = await this.loginService.checkIsLocked(
        reqTime,
        user.lockExpiry,
      );
      this.log.verbose(`isLocked: ${isLocked}`);
      if (isLocked) throw UnauthorizedException;
      const isValidCredentials = await this.loginService.validateCredentials(
        credentials,
        user.password,
      );
      this.log.verbose(`isValidCredentials: ${isValidCredentials}`);
      if (!isValidCredentials) {
        await this.loginService.updateFailedAttempt({
          username: credentials.username,
        });
        throw UnauthorizedException;
      } else {
        const response = await this.loginService.postSuccesfullLogin({
          username: credentials.username,
        });
        return response;
      }
    } catch (error) {
      return 'Login Failed';
    }
  }
}
