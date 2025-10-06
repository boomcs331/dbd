import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { CreateReconcileDto } from './dto/create-reconcile.dto';
import { WebhookLog } from 'src/webhook/entities/webhook-log.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { firstValueFrom } from 'rxjs';
import { WebhookService } from 'src/webhook/webhook.service';

@Injectable()
export class ReconcileService {
  constructor(
    private readonly httpService: HttpService, // ✅ Inject HttpService here
    @InjectRepository(WebhookLog)
    private readonly webhookRepo: Repository<WebhookLog>,
    private readonly webhookService: WebhookService,
  ) {}

  async getDataLogs(createReconcileDto: CreateReconcileDto) {
    console.log('createReconcileDto', createReconcileDto.received_at);

    const [dataLogs, count] = await this.webhookRepo.findAndCount({
      where: {
        received_at: Like(`%${createReconcileDto.received_at}%`),
      },
      order: {
        id: 'DESC',
      },
    });

    return {
      count,
      data: dataLogs,
    };
  }

  async getLogsWebhookServiceTfac(createReconcileDto: CreateReconcileDto) {
    const received_at: string = createReconcileDto.received_at;
    console.log('received_at', received_at);

    try {
      const response = await firstValueFrom(
        this.httpService.post(
          'http://localhost:3000/reconcile/get-log-webhook',
          {
            received_at,
          },
        ),
      );

      console.log('Response from webhook service:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error calling webhook service:', error.message);
      throw error;
    }
  }

  async getReconcile(createReconcileDto: CreateReconcileDto) {
    const received_at: string = createReconcileDto.received_at;
    //console.log("received_at", received_at);

    try {
      const response_data_tfac =
        await this.getLogsWebhookServiceTfac(createReconcileDto);
      const response_data_dbd = await this.getDataLogs(createReconcileDto);

      const expected_count = response_data_dbd.count;
      const received_count = response_data_tfac.count;

      if (expected_count === received_count) {
        return { message: '🎉 Reconcile matched, no action needed' };
      }

      const receiverTransactionIds = new Set(
        response_data_tfac.data.map((log) => log.rabbitmq_id),
      );

      const unmatchedSenderLogs = response_data_dbd.data.filter(
        (log) => !receiverTransactionIds.has(log.rabbitmq_id),
      );

      const unmatchedReceiverLogs = response_data_tfac.data.filter(
        (log) =>
          !response_data_dbd.data.some(
            (sender) => sender.rabbitmq_id === log.rabbitmq_id,
          ),
      );

      // ส่ง unmatchedReceiverLogs ไปยัง webhookService
      const webhookPayload = { unmatched_receiver_logs: unmatchedReceiverLogs };
      // Collect results from each webhook call
      const webhookResults: {
        log_id: any;
        status: 'success' | 'error';
        result?: any;
        error?: any;
      }[] = [];

      for (const log of webhookPayload.unmatched_receiver_logs) {
        try {
          const result = await this.webhookService.handleIncomingWebhook(
            log.payload,
          );
          webhookResults.push({ log_id: log.id, status: 'success', result });
        } catch (err) {
          webhookResults.push({
            log_id: log.id,
            status: 'error',
            error: err.message,
          });
        }
      }

      return {
        message: '⚠️ Reconcile mismatch found',
        expected_count,
        received_count,
        difference: Math.abs(expected_count - received_count),
        unmatched_sender_logs: unmatchedSenderLogs,
        unmatched_receiver_logs: unmatchedReceiverLogs,
        webhook_results: webhookResults, // ← now returns full result list
      };
    } catch (error) {
      console.error('Error calling webhook service:', error.message);
      throw new Error(`Failed to reconcile logs: ${error.message}`);
    }
  }
}
