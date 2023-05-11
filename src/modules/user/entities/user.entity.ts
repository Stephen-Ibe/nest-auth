import { Exclude } from 'class-transformer';
import { BaseTable } from 'src/base';
import { Column, Entity } from 'typeorm';

@Entity('user')
export class User extends BaseTable {
  @Column({ type: 'varchar' })
  firstName: string;

  @Column({ type: 'varchar' })
  lastName: string;

  @Column({ type: 'varchar', unique: true, nullable: true, length: 50 })
  email: string;

  @Column({ type: 'varchar', unique: true, nullable: true, length: 20 })
  phoneNumber: string;

  @Exclude()
  @Column({ type: 'text', nullable: false })
  password: string;

  @Column({ type: 'boolean', default: false })
  isVerified: boolean;
}
