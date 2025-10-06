import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Not, Repository } from 'typeorm';
import { WebhookLog } from './entities/webhook-log.entity';
import { Members } from './entities/MemberService.entity';
import * as dayjs from 'dayjs';
import { WebhookGateway } from './webhook.gateway';

interface WebhookPayload {
  id_no?: string;
  event_type?: string;
  received_at?: string;
  rabbitmq_id?: string;
  member_name?: string;
  title?: string;
  member_type?: number;
  member_type_name?: string;
  status?: number;
  status_name?: string;
  education_level?: string;
  college_name?: string;
  curriculum_name?: string;
  registration_date?: string;
  expired_date?: string;
  college_id?: number;
  curriculum_id?: number;
  education_id?: number;
  payload?: any;
}

@Injectable()
export class WebhookService {
  constructor(
    @InjectRepository(WebhookLog)
    private readonly webhookRepo: Repository<WebhookLog>,
    private readonly gateway: WebhookGateway,

    @InjectRepository(Members)
    private readonly memberRepo: Repository<Members>,
  ) {}

  private async saveWebhookLog(
    payload: WebhookPayload | WebhookLog | null,
    status: string,
    error_message: string | null = null,
  ): Promise<void> {
    const log = new WebhookLog();
    log.id_no = payload?.id_no ?? null;
    log.event_type = payload?.event_type ?? null;
    log.received_at = payload?.received_at || '';
    log.status = status;
    log.error_message = error_message;
    log.rabbitmq_id = payload?.rabbitmq_id ?? null;
    log.payload = payload?.payload || payload;
    log.created_at = new Date();

    const savedLog = await this.webhookRepo.save(log);

    this.gateway.emitWebhookLog(savedLog);
  }

  private async updateWebhookLog(
    payload: WebhookPayload | WebhookLog | null,
    status: string,
    id: number,
  ): Promise<void> {
    // อัปเดตข้อมูล
    await this.webhookRepo.update(id, {
      status,
      updated_at: new Date(), // ใช้ updated_at แทน created_at
    });
    // ดึงข้อมูล log ที่เพิ่งอัปเดตมาใหม่
    const updatedLog = await this.webhookRepo.findOne({ where: { id } });
    // ส่ง log ไปยัง gateway
    if (updatedLog) {
      this.gateway.emitWebhookLog(updatedLog);
    }
  }

  private async addMember(payload: WebhookPayload): Promise<void> {
    const memberName = payload.member_name || '';
    const [firstName = '', lastName = ''] = memberName.split(' ');

    const member = this.memberRepo.create({
      id_no: payload.id_no,
      first_name: firstName,
      last_name: lastName,
      title: payload.title || undefined,
      member_type: payload.member_type ?? undefined,
      member_type_name: payload.member_type_name || undefined,
      status: payload.status ?? undefined,
      status_name: payload.status_name || undefined,
      education_level: payload.education_level || undefined,
      college_name: payload.college_name || undefined,
      curriculum_name: payload.curriculum_name || undefined,
      registration_date: payload.registration_date
        ? new Date(payload.registration_date)
        : undefined,
      expired_date: payload.expired_date
        ? new Date(payload.expired_date)
        : undefined,
      created_date: new Date(),
      college_id: payload.college_id,
      curriculum_id: payload.curriculum_id,
      education_id: payload.education_id,
    });
    await this.memberRepo.save(member);
  }

  private async UpdateAddMember(payload: WebhookPayload): Promise<void> {
    const memberName = payload.member_name || '';
    const [firstName = '', lastName = ''] = memberName.split(' ');

    await this.memberRepo.update(
      { id_no: payload.id_no }, // <-- WHERE clause
      {
        first_name: firstName,
        last_name: lastName,
        title: payload.title || undefined,
        member_type: payload.member_type ?? undefined,
        member_type_name: payload.member_type_name || undefined,
        status: payload.status ?? undefined,
        status_name: payload.status_name || undefined,
        education_level: payload.education_level || undefined,
        college_name: payload.college_name || undefined,
        curriculum_name: payload.curriculum_name || undefined,
        registration_date: payload.registration_date
          ? new Date(payload.registration_date)
          : undefined,
        expired_date: payload.expired_date
          ? new Date(payload.expired_date)
          : undefined,
        updated_date: new Date(), // Use updated_date, not created_date
        college_id: payload.college_id,
        curriculum_id: payload.curriculum_id,
        education_id: payload.education_id,
      },
    );
  }

  private async UpdateRenewMember(payload: WebhookPayload): Promise<void> {
    await this.memberRepo.update(
      { id_no: payload.id_no, status: Not(4) }, // <-- WHERE clause
      {
        /* first_name: firstName,
        last_name: lastName, */
        title: payload.title || undefined,
        expired_date: payload.expired_date
          ? new Date(payload.expired_date)
          : undefined,
        updated_date: new Date(),
        created_by: process.env.CREATED_BY,
      },
    );
  }

  private async UpdateStatusChangeMember(
    payload: WebhookPayload,
  ): Promise<void> {
    const isCancelled =
      payload.status == Number(process.env.MEMBER_REQUEST_STATUS_CANCELLED);
    const expiredDate = isCancelled
      ? new Date('1990-01-01')
      : payload.expired_date
        ? new Date(payload.expired_date)
        : undefined;

    const updateData: Partial<Members> = {
      /* first_name: firstName,
      last_name: lastName, */
      title: payload.title || undefined,
      status: payload.status,
      status_name: payload.status_name,
      updated_date: new Date(),
      created_by: process.env.CREATED_BY,
    };

    if (payload.status == Number(process.env.MEMBER_REQUEST_STATUS_CANCELLED)) {
      updateData.expired_date = expiredDate;
    }

    await this.memberRepo.update(
      { id_no: payload.id_no, status: Not(4) },
      updateData,
    );
  }

  private async UpdateNameChangeMember(payload: WebhookPayload): Promise<void> {
    const memberName = payload.member_name || '';
    const [firstName = '', lastName = ''] = memberName.split(' ');

    await this.memberRepo.update(
      { id_no: payload.id_no, status: Not(4) }, // <-- WHERE clause
      {
        first_name: firstName,
        last_name: lastName,
        title: payload.title || undefined,
        updated_date: new Date(),
        created_by: process.env.CREATED_BY,
      },
    );
  }

  private async UpdateTypeChangeMember(payload: WebhookPayload): Promise<void> {
    const memberName = payload.member_name || '';
    const [firstName = '', lastName = ''] = memberName.split(' ');

    await this.memberRepo.update(
      { id_no: payload.id_no, status: Not(4) }, // <-- WHERE clause
      {
        first_name: firstName,
        last_name: lastName,
        title: payload.title || undefined,
        member_type: payload.member_type,
        member_type_name: payload.member_type_name,
        updated_date: new Date(),
        created_by: process.env.CREATED_BY,
      },
    );
  }

  private async UpdateEducationChangeMember(
    payload: WebhookPayload,
  ): Promise<void> {
    await this.memberRepo.update(
      { id_no: payload.id_no, status: Not(4) }, // <-- WHERE clause
      {
        /* first_name: firstName,
        last_name: lastName, */
        title: payload.title || undefined,
        education_id: payload.education_id,
        education_level: payload.education_level,
        college_id: payload.college_id,
        college_name: payload.college_name,
        curriculum_id: payload.curriculum_id,
        curriculum_name: payload.curriculum_name,
        updated_date: new Date(),
        created_by: process.env.CREATED_BY,
      },
    );
  }

  async handleIncomingWebhook(payload: WebhookPayload | null) {
    if (!payload) {
      await this.saveWebhookLog(payload, 'failed', 'No payload received');
      return { message: '❌ No payload received' };
    }

    try {
      const { id_no, event_type, received_at } = payload;
      const timestampPayload = dayjs(received_at).toDate();
      const isExactDuplicate = await this.webhookRepo.findOne({
        where: {
          id_no,
          event_type,
          received_at,
        },
      });
      const isMemberExist = await this.memberRepo.findOne({
        where: {
          id_no,
          status: Not(4),
        },
      });
      const isMemberActive = await this.memberRepo.findOne({
        where: {
          id_no,
          status: Not(In([4, 2])),
        },
      });
      const countMember = await this.memberRepo.count({
        where: {
          id_no,
        },
      });
      const countMemberCancel = await this.memberRepo.count({
        where: {
          id_no,
          status: 4,
        },
      });
      const MemberCancel = await this.memberRepo.findOne({
        where: {
          id_no,
        },
        order: { created_date: 'DESC' },
      });
      const countMemberInactive = await this.memberRepo.count({
        where: {
          id_no,
          status: 2,
        },
      });
      const getTimestampMember = await this.webhookRepo.findOne({
        where: { id_no, event_type },
        order: { received_at: 'DESC' },
      });
      const timestampLog = getTimestampMember?.received_at
        ? dayjs(getTimestampMember.received_at).toDate()
        : null;
      // Fetch latest webhook data for each event type
      const events = [
        { key: 'idNoDataRegis', type: process.env.MEMBER_REGISTERED },
        { key: 'idNoDataStatus', type: process.env.MEMBER_STATUS_CHANGED },
        { key: 'idNoDataRenew', type: process.env.MEMBER_RENEWAL },
        { key: 'idNoDataType', type: process.env.MEMBER_TYPE_CHANGED },
        {
          key: 'idNoDataEducation',
          type: process.env.MEMBER_EDUCATION_CHANGED,
        },
        { key: 'idNoDataName', type: process.env.MEMBER_NAME_CHANGED },
      ];
      const eventResults: Record<string, WebhookLog | null> = {};
      for (const e of events) {
        eventResults[e.key] = await this.webhookRepo.findOne({
          where: {
            id_no,
            event_type: e.type,
          },
          order: {
            received_at: 'DESC',
          },
        });
      }

      // Log timestamps for debugging
      console.log('Regis', eventResults.idNoDataRegis?.received_at);
      console.log('Status', eventResults.idNoDataStatus?.received_at);
      console.log('Renew', eventResults.idNoDataRenew?.received_at);
      console.log('Type', eventResults.idNoDataType?.received_at);
      console.log('Education', eventResults.idNoDataEducation?.received_at);
      console.log('Name', eventResults.idNoDataName?.received_at);
      // Validate MEMBER_REGISTERED event timing
      if (event_type === process.env.MEMBER_REGISTERED) {
        if (isMemberActive) {
          await this.saveWebhookLog(payload, 'failed', 'Member duplicate');
          return { message: '❌ Member duplicate' };
        }

        if (countMemberInactive > 0) {
          await this.saveWebhookLog(payload, 'failed', 'Member Inactive');
          return { message: '❌ Member Inactive' };
        }

        const incomingReceivedAt = new Date(payload.received_at || '');

        const conflictChecks = [
          { label: 'STATUS_CHANGED', data: eventResults.idNoDataStatus },
          { label: 'RENEW_CHANGED', data: eventResults.idNoDataRenew },
          { label: 'TYPE_CHANGED', data: eventResults.idNoDataType },
          { label: 'EDUCATION_CHANGED', data: eventResults.idNoDataEducation },
          { label: 'NAME_CHANGED', data: eventResults.idNoDataName },
        ];

        const newerEvents = conflictChecks.filter(
          ({ data }) =>
            data?.received_at &&
            new Date(data.received_at) > incomingReceivedAt,
        );

        if (newerEvents.length > 0) {
          console.log(
            '⛔ Ignoring MEMBER_REGISTERED: newer event(s) already received.',
          );

          // Merge data from all possible events
          const newPayload: WebhookPayload = {
            ...payload,
            expired_date:
              eventResults.idNoDataRenew?.payload?.expired_date ??
              payload.expired_date,
            member_type:
              eventResults.idNoDataType?.payload?.member_type ??
              payload.member_type,
            member_type_name:
              eventResults.idNoDataType?.payload?.member_type_name ??
              payload.member_type_name,
            education_id:
              eventResults.idNoDataEducation?.payload?.education_id ??
              payload.education_id,
            education_level:
              eventResults.idNoDataEducation?.payload?.education_level ??
              payload.education_level,
            college_id:
              eventResults.idNoDataEducation?.payload?.college_id ??
              payload.college_id,
            college_name:
              eventResults.idNoDataEducation?.payload?.college_name ??
              payload.college_name,
            curriculum_id:
              eventResults.idNoDataEducation?.payload?.curriculum_id ??
              payload.curriculum_id,
            curriculum_name:
              eventResults.idNoDataEducation?.payload?.curriculum_name ??
              payload.curriculum_name,
            member_name:
              eventResults.idNoDataName?.payload?.member_name ??
              payload.member_name,
            title: eventResults.idNoDataName?.payload?.title ?? payload.title,
          };

          // Deactivate all conflicting newer events
          for (const { label, data } of newerEvents) {
            if (data) {
              await this.updateWebhookLog(data, 'Inactive', data.id);
              await this.saveWebhookLog(data, 'success');
            }
          }

          await this.saveWebhookLog(newPayload, 'success');
          await this.addMember(newPayload);
          return { message: '✅ Webhook processed with updated payload' };
        }

        // ✅ Process normally if no conflict
        console.log(
          '✅ MEMBER_REGISTERED event is valid and will be processed.',
        );
        await this.addMember(payload);
        await this.saveWebhookLog(payload, 'success');
        return { message: '✅ Webhook processed and saved' };
      }

      //ถ้าส่ง id_no , event_type , recived_at ซ้ํากันเป็น duplicate
      if (isExactDuplicate) {
        await this.saveWebhookLog(
          payload,
          'failed',
          'Exact duplicate webhook entry',
        );
        return { message: '⚠️ Duplicate webhook entry' };
      }
      if (timestampLog && timestampLog > timestampPayload) {
        await this.saveWebhookLog(
          payload,
          'skipped',
          'Incoming webhook is older than latest recorded one',
        );
        return {
          message: '⚠️ Incoming webhook is older than latest recorded one',
        };
      }

      if (event_type === process.env.MEMBER_STATUS_CHANGED) {
        if (MemberCancel?.status == 4) {
          await this.saveWebhookLog(payload, 'failed', 'Member Cancel');
          return { message: '❌ Member Inactive' };
        }
        await this.UpdateStatusChangeMember(payload);
      }
      if (event_type === process.env.MEMBER_RENEWAL) {
        if (MemberCancel?.status == 4) {
          await this.saveWebhookLog(payload, 'failed', 'Member Cancel');
          return { message: '❌ Member Inactive' };
        }
        await this.UpdateRenewMember(payload);
      }
      if (event_type === process.env.MEMBER_EDUCATION_UPDATED) {
        if (MemberCancel?.status == 4) {
          await this.saveWebhookLog(payload, 'failed', 'Member Cancel');
          return { message: '❌ Member Inactive' };
        }
        await this.UpdateEducationChangeMember(payload);
      }
      if (event_type === process.env.MEMBER_TYPE_CHANGED) {
        if (MemberCancel?.status == 4) {
          await this.saveWebhookLog(payload, 'failed', 'Member Cancel');
          return { message: '❌ Member Inactive' };
        }
        await this.UpdateTypeChangeMember(payload);
      }
      if (event_type === process.env.MEMBER_NAME_CHANGED) {
        if (MemberCancel?.status == 4) {
          await this.saveWebhookLog(payload, 'failed', 'Member Cancel');
          return { message: '❌ Member Inactive' };
        }
        await this.UpdateNameChangeMember(payload);
      }
      await this.saveWebhookLog(payload, 'success');
      return { message: '✅ Webhook processed and saved' };
    } catch (error: any) {
      console.error('❌ Error processing webhook:', error);
      await this.saveWebhookLog(payload, 'error', error.message);
      return { message: '❌ Error while processing webhook' };
    }
  }

  async getMember() {
    return await this.memberRepo.find({
      relations: [
        'memberType',
        'memberStatus',
        'memberEducation',
        'memberCollege',
        'memberCurriculum',
      ],
    });
  }
}
