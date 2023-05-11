import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import typeormDatasource, { datasourceOptions } from './typeorm-datasource';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => datasourceOptions,
      dataSourceFactory: async () => {
        return typeormDatasource.initialize();
      },
    }),
  ],
})
export class DatabaseModule {}
