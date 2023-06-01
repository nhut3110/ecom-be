import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { AppConfigModule } from 'src/modules/config/app-config.module';
import { AppConfigService } from 'src/modules/config/app-config.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

@Module({
  imports: [
    AppConfigModule,
    MailerModule.forRoot({
      transport: 'smtps://user@domain.com:pass@smtp.domain.com',
      template: {
        dir: __dirname + '/templates/',
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
  ],
  providers: [MailService, AppConfigService],
})
export class MailModule {}
