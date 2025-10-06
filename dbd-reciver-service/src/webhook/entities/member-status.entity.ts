import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class MemberStatus {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: true })
  name: string;

  @Column({ type: 'boolean', nullable: true })
  active: boolean;
}
