import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);
  getHello(): string {
    this.logger.warn('Hello World!');
    //this.logger.warn(`${PartnersService.name}: Role with ID ${role_id} not found`);
    return 'Hello World!';
  }
}
