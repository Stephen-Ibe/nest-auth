import { BaseTable } from 'src/base';
import { Entity, OneToMany, OneToOne } from 'typeorm';
import { User } from './user.entity';
import { Photo } from './photo.entity';

@Entity('client')
export class Client extends BaseTable {
  @OneToOne(() => User, (user) => user.client)
  user: User;

  @OneToMany(() => Photo, (photo) => photo.client, { eager: true })
  photos: Photo[];
}
