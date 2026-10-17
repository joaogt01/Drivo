
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CrlvController } from './crlv.controller';
import { CrlvService } from './crlv.service';

@Module({
  imports: [ConfigModule],
  controllers: [CrlvController],
  providers: [CrlvService],
})
export class CrlvModule {}
