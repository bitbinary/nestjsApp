import { Module } from '@nestjs/common';

import { LoginModule } from './login/login.module';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';

@Module({
  imports: [LoginModule], // Manages the login part of Authentication
  controllers: [AuthenticationController], // Acts as the main controller for Auth related activities
  providers: [AuthenticationService], //Acts as the main service which contains the function for the controller
  exports: [],
})
export class AuthenticationModule {}
