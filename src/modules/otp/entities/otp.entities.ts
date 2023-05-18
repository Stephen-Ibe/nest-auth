import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IOtpType } from '../otp.interface';
import { User } from 'src/modules/user/entities';

@Entity()
export class Otp {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', nullable: false, length: 6 })
  code: string;

  @Column({ type: 'boolean', nullable: false, default: false })
  isValid: boolean;

  @Column({ type: 'varchar', nullable: false })
  type: IOtpType;

  @Column({ type: 'varchar' })
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
