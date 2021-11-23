import { TokenModule } from './../token/token.module';
import { Module } from '@nestjs/common';
import { LoginService } from './login.service';
import { LoginController } from './login.controller';
import { UserModule } from '../../database/user/user.module';
import { UserService } from '../../database/user/user.service';

@Module({
  imports: [UserModule, TokenModule],
  providers: [LoginService, UserService],
  controllers: [LoginController],
  exports: [],
})
export class LoginModule {}
