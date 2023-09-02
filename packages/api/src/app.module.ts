import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SiweController } from './siwe/siwe.controller';
import { RedisModule } from './redis/redis.module';

@Module({
  imports: [RedisModule],
  controllers: [AppController, SiweController],
  providers: [AppService],
})
export class AppModule {}
