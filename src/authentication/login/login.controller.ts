import { Controller, Post } from '@nestjs/common';

@Controller('login')
export class LoginController {
  @Post('')
  async doLogin() {
    try {
      return 'Login';
    } catch (error) {
      throw error;
    }
  }
}
