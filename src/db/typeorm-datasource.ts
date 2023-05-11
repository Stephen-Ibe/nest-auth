import { DataSource, DataSourceOptions } from 'typeorm';
import { DATABASE_URL } from './config';

export const datasourceOptions: DataSourceOptions = {
  type: 'postgres',
  url: DATABASE_URL,
};

export default new DataSource(datasourceOptions);
