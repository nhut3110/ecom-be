import { Module } from '@nestjs/common';
import { AppConfigModule } from 'src/modules/config/app-config.module';
import { ProxyService } from './proxy.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [AppConfigModule, HttpModule],
  providers: [ProxyService],
  exports: [ProxyService],
})
export class ProxyModule {}
