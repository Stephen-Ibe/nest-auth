import { Otp } from 'src/modules/otp/entities/otp.entities';
import { User } from 'src/modules/user/entities/user.entity';
import { DataSource, DataSourceOptions } from 'typeorm';
import { DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT, DB_USERNAME } from './config';

export const datasourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: DB_HOST,
  port: parseInt(DB_PORT, 10),
  username: DB_USERNAME,
  password: DB_PASSWORD,
  database: DB_NAME,
  entities: [User, Otp],
  synchronize: true,
  // dropSchema: true,
};

export default new DataSource(datasourceOptions);
