import { Module } from '@nestjs/common';
import { LoginService } from './login.service';
import { LoginController } from './login.controller';
import { UserModule } from 'src/database/user/user.module';
import { UserService } from 'src/database/user/user.service';

@Module({
  imports: [UserModule],
  providers: [LoginService, UserService],
  controllers: [LoginController],
  exports: [],
})
export class LoginModule {}
