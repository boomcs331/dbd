import { Controller, Post, Body } from '@nestjs/common';
import { ReconcileService } from './reconcile.service';
import { CreateReconcileDto } from './dto/create-reconcile.dto';

@Controller('reconcile')
export class ReconcileController {
  constructor(private readonly reconcileService: ReconcileService) {}

  @Post('get-data-logs')
  async create(@Body() createReconcileDto: CreateReconcileDto) {
    const res = await this.reconcileService.getDataLogs(createReconcileDto);
    return res;
  }

  @Post('get-data-logs-tfac')
  getLogsWebhookServiceTfac(@Body() createReconcileDto: CreateReconcileDto) {
    return this.reconcileService.getLogsWebhookServiceTfac(createReconcileDto);
  }

  @Post('data-reconcile')
  getReconcile(@Body() createReconcileDto: CreateReconcileDto) {
    return this.reconcileService.getReconcile(createReconcileDto);
  }
}
