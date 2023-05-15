import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { DatabaseModule } from 'src/db/db.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { CloudinaryModule } from 'nestjs-cloudinary';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
    }),
    ThrottlerModule.forRoot({ ttl: 60 * 60, limit: 100 }),
    DatabaseModule,
    UserModule,
    AuthModule,
    CloudinaryModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        isGlobal: true,
        cloud_name: configService.get('CLD_CLOUD_NAME'),
        api_key: configService.get('CLD_API_KEY'),
        api_secret: configService.get('CLD_API_SECRET'),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
