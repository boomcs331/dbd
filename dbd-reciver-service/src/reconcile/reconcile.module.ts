import { Module } from '@nestjs/common';
import { ReconcileService } from './reconcile.service';
import { ReconcileController } from './reconcile.controller';
import { WebhookLog } from 'src/webhook/entities/webhook-log.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WebhookModule } from 'src/webhook/webhook.module';
import { HttpModule } from '@nestjs/axios';
import { WebhookService } from 'src/webhook/webhook.service';
import { Members } from 'src/webhook/entities/MemberService.entity';

@Module({
  imports: [
    HttpModule,
    WebhookModule,
    TypeOrmModule.forFeature([WebhookLog, Members]),
  ],
  controllers: [ReconcileController],
  providers: [ReconcileService, WebhookService],
})
export class ReconcileModule {}
