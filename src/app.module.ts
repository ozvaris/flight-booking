// src/app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { User } from './user/user.entity';
import { AppController } from './app.controller';
import { AppService } from './app.service';

//console.log('NODE_ENV:', process.env.NODE_ENV);
if (process.env.NODE_ENV !== 'test') {
  console.log('DATABASE_HOST:', process.env.DATABASE_HOST);
  console.log('DATABASE_PORT:', process.env.DATABASE_PORT);
  console.log('DATABASE_USERNAME:', process.env.DATABASE_USERNAME);
  console.log('DATABASE_PASSWORD:', process.env.DATABASE_PASSWORD);
  console.log('DATABASE_NAME:', process.env.DATABASE_NAME);
}

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: process.env.NODE_ENV === 'test' ? 'sqlite' : 'postgres',
      database: process.env.NODE_ENV === 'test' ? ':memory:' : process.env.DATABASE_NAME,
      entities: [User],
      synchronize: true,
      host: process.env.NODE_ENV === 'test' ? undefined : process.env.DATABASE_HOST,
      port: process.env.NODE_ENV === 'test' ? undefined : parseInt(process.env.DATABASE_PORT, 10),
      username: process.env.NODE_ENV === 'test' ? undefined : process.env.DATABASE_USERNAME,
      password: process.env.NODE_ENV === 'test' ? undefined : process.env.DATABASE_PASSWORD,
    }),
    AuthModule,
  ],
  providers: [AppService],
  controllers: [AppController],
})
export class AppModule {}


