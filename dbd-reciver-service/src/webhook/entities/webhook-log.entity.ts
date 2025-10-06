// src/webhook/entities/webhook-log.entity.ts
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
@Entity('queue_webhook_log')
export class WebhookLog {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('json', { nullable: true })
    payload: any;
    @Column({ type: 'varchar', nullable: true })
    id_no: string | null;
    @Column({ type: 'varchar', length: 50 })
    status: string;

    @Column({ type: 'varchar', nullable: true })
    error_message: string | null;

    @Column({ type: 'varchar' }) // ✅ เป็น string ไม่ใช่ timestamp
    received_at: string;

    @Column({ type: 'varchar', nullable: true })
    rabbitmq_id: string | null;

    @Column({ type: 'varchar', nullable: true })
    event_type: string | null;

    @Column({ type: 'timestamp' })
    created_at: Date;
    @Column({ type: 'timestamp', nullable: true })
    updated_at: Date;
}
