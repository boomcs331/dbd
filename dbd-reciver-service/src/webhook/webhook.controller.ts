import { Controller, Post, Body } from '@nestjs/common';
import { WebhookService } from './webhook.service';

@Controller('webhook')
export class WebhookController {
  constructor(private readonly webhookService: WebhookService) {}

  @Post()
  async handleWebhook(@Body() payload: any) {
    const res = await this.webhookService.handleIncomingWebhook(payload);
    return res;
  }

  @Post('get-member')
  async testQuery() {
    const res = await this.webhookService.getMember();
    return res;
  }
}
