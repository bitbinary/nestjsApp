import { TokenModule } from './../token/token.module';
import { Module } from '@nestjs/common';
import { LoginService } from './login.service';
import { LoginController } from './login.controller';
import { UserModule } from '../../database/user/user.module';
import { UserService } from '../../database/user/user.service';

@Module({
  imports: [UserModule, TokenModule], // User module helps with activited related to user binding with the Database, Token Module handles token management, verification
  providers: [LoginService, UserService], // Provides the related functionalities for login and user manipulation during login
  controllers: [LoginController], // Resolves the main requests to the login api and controls the behavior.
  exports: [],
})
export class LoginModule {}
