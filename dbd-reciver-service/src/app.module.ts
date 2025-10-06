import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule, LoggerModule } from '@app/common';
import { WebhookModule } from './webhook/webhook.module';
import { ReconcileModule } from './reconcile/reconcile.module';

@Module({
  imports: [DatabaseModule, LoggerModule, WebhookModule, ReconcileModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
