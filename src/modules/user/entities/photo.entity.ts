import { BaseTable } from 'src/base';
import { Column, Entity, ManyToOne } from 'typeorm';
import { User } from './user.entity';

@Entity('photo')
export class Photo extends BaseTable {
  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar' })
  url: string;

  @ManyToOne(() => User)
  user: User;
}
