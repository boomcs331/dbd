// src/webhook/webhook.gateway.ts
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WebhookLog } from './entities/webhook-log.entity';

@WebSocketGateway({
  namespace: '/socket',
  cors: {
    origin: '*',
  },
})
export class WebhookGateway {
  @WebSocketServer()
  server!: Server;

  constructor(
    @InjectRepository(WebhookLog)
    private readonly webhookLogRepo: Repository<WebhookLog>,
  ) {}

  // ✅ เมื่อ frontend ขอข้อมูล log ทั้งหมด
  @SubscribeMessage('get-webhook-logs')
  async handleGetWebhookLogs() {
    const logs = await this.webhookLogRepo.find({
      order: { created_at: 'DESC' },
      take: 50, // ดึง 50 รายการล่าสุด
    });
    this.server.emit('webhook-logs', logs);
  }

  // ✅ ใช้ใน webhook-consumer service
  emitWebhookLog(log: WebhookLog) {
    this.server.emit('webhook-log', {
      id: log.id,
      event_type: log.event_type,
      status: log.status,
      received_at: log.received_at,
      errorMessage: log.error_message,
      payload: log.payload,
      rabbitmq_id: log.rabbitmq_id,
    });
  }
}
