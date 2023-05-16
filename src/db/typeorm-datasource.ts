import { DataSource, DataSourceOptions } from 'typeorm';
import { DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT, DB_USERNAME } from './config';
import { User } from 'src/modules/user/entities/user.entity';
import { Client, Photo } from 'src/modules/user/entities';
import { Otp } from 'src/modules/otp/entities/otp.entities';

export const datasourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: DB_HOST,
  port: parseInt(DB_PORT, 10),
  username: DB_USERNAME,
  password: DB_PASSWORD,
  database: DB_NAME,
  entities: [User, Client, Photo, Otp],
  synchronize: true,
};

export default new DataSource(datasourceOptions);
