import { Column, CreateDateColumn, PrimaryGeneratedColumn } from 'typeorm';

export class Otp {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', nullable: false, length: 6 })
  code: string;

  @Column({ type: 'boolean', nullable: false })
  isValid: boolean;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
