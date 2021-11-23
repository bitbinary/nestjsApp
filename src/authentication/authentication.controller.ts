import { Controller, Logger } from '@nestjs/common';

@Controller('authentication')
export class AuthenticationController {
  logger: Logger = new Logger(AuthenticationController.name);
}
