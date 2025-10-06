import { Module } from '@nestjs/common';
import { WebhookService } from './webhook.service';
import { WebhookController } from './webhook.controller';
import { WebhookLog } from './entities/webhook-log.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Members } from './entities/MemberService.entity';
import { MemberType } from './entities/member-type.entity';
import { MemberStatus } from './entities/member-status.entity';
import { MemberEducation } from './entities/member-education.entity';
import { MemberCollege } from './entities/member-college.entity';
import { MemberCurriculum } from './entities/member-curriculum';
import { WebhookGateway } from './webhook.gateway';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      WebhookLog,
      Members,
      MemberType,
      MemberStatus,
      MemberEducation,
      MemberCollege,
      MemberCurriculum,
    ]),
  ],
  controllers: [WebhookController],
  providers: [WebhookService, WebhookGateway],
  exports: [WebhookGateway],
})
export class WebhookModule {}
