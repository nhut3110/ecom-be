import { Injectable } from '@nestjs/common';
import { AppConfigService } from 'src/modules/config/app-config.service';
import { MailerService } from '@nestjs-modules/mailer';
import { google } from 'googleapis';
import { Options } from 'nodemailer/lib/smtp-transport';

@Injectable()
export class MailService {
  constructor(
    private readonly appConfigService: AppConfigService,
    private readonly mailerService: MailerService,
  ) {}

  private async setTransport() {
    const OAuth2 = google.auth.OAuth2;
    const oauth2Client = new OAuth2(
      this.appConfigService.googleClientId,
      this.appConfigService.googleClientSecret,
      'https://developers.google.com/oauthplayground',
    );

    oauth2Client.setCredentials({
      refresh_token: this.appConfigService.googleToken,
    });

    const accessToken: string = await new Promise((resolve, reject) => {
      oauth2Client.getAccessToken((err, token) => {
        if (err) {
          reject('Failed to create access token');
        }
        resolve(token);
      });
    });

    const config: Options = {
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: 'nhut.vo200205@vnuk.edu.vn',
        clientId: this.appConfigService.googleClientId,
        clientSecret: this.appConfigService.googleClientSecret,
        accessToken,
      },
    };
    this.mailerService.addTransporter('gmail', config);
  }

  public async sendOTPMail(email: string, code: string): Promise<boolean> {
    await this.setTransport();
    await this.mailerService
      .sendMail({
        transporterName: 'gmail',
        to: email,
        subject: 'Verification Code - Fake Store',
        template: './action',
        context: {
          code: code,
        },
      })
      .then(() => {
        return true;
      })
      .catch(() => {
        return false;
      });
  }
}
