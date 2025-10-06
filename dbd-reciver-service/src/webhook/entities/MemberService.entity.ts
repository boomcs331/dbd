import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { MemberType } from './member-type.entity';
import { MemberStatus } from './member-status.entity';
import { MemberEducation } from './member-education.entity';
import { MemberCollege } from './member-college.entity';
import { MemberCurriculum } from './member-curriculum';

@Entity()
export class Members {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', nullable: true })
  member_type: number;

  @ManyToOne(() => MemberType, { nullable: true })
  @JoinColumn({ name: 'member_type' }) // 👈 ระบุคอลัมน์ที่ใช้ join
  memberType: MemberType;

  // 👇 ส่วนอื่นเหมือนเดิม
  @Column({ type: 'int', nullable: true })
  status: number;

  @ManyToOne(() => MemberStatus, { nullable: true })
  @JoinColumn({ name: 'status' }) // 👈 ระบุคอลัมน์ที่ใช้ join
  memberStatus: MemberStatus;

  @Column({ type: 'int', nullable: true })
  education_id: number;

  @ManyToOne(() => MemberEducation, { nullable: true })
  @JoinColumn({ name: 'education_id' }) // 👈 ระบุคอลัมน์ที่ใช้ join
  memberEducation: MemberEducation;

  @Column({ type: 'int', nullable: true })
  college_id: number;

  @ManyToOne(() => MemberCollege, { nullable: true })
  @JoinColumn({ name: 'college_id' }) // 👈 ระบุคอลัมน์ที่ใช้ join
  memberCollege: MemberCollege;

  @Column({ type: 'int', nullable: true })
  curriculum_id: number;

  @ManyToOne(() => MemberCurriculum, { nullable: true })
  @JoinColumn({ name: 'curriculum_id' }) // 👈 ระบุคอลัมน์ที่ใช้ join
  memberCurriculum: MemberCurriculum;

  @Column({ type: 'varchar', nullable: true })
  id_no: string;

  @Column({ type: 'varchar', nullable: true })
  title: string;

  @Column({ type: 'varchar', nullable: true })
  first_name: string;

  @Column({ type: 'varchar', nullable: true })
  last_name: string;

  @Column({ type: 'varchar', nullable: true })
  member_type_name: string;

  @Column({ type: 'varchar', nullable: true })
  status_name: string;

  @Column({ type: 'varchar', nullable: true })
  education_level: string;

  @Column({ type: 'varchar', nullable: true })
  college_name: string;

  @Column({ type: 'varchar', nullable: true })
  curriculum_name: string;

  @Column({ type: 'date', nullable: true })
  registration_date: Date;

  @Column({ type: 'date', nullable: true })
  expired_date: Date;

  @Column({ type: 'timestamp', nullable: true })
  created_date: Date;

  @Column({ type: 'timestamp', nullable: true })
  updated_date: Date;

  @Column({ type: 'varchar', nullable: true })
  created_by: string;

  @Column({ type: 'varchar', nullable: true })
  updated_by: string;
}
