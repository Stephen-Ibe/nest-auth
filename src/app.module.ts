import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from 'src/db/db.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
    }),
    DatabaseModule,
    UserModule,
    AuthModule,
    {
      ...JwtModule.register({
        secret: 'JWT_SECRET',
        signOptions: {},
      }),
      global: true,
    },
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
