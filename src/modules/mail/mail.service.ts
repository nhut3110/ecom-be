import { google } from 'googleapis';
import { Options } from 'nodemailer/lib/smtp-transport';
import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { AppConfigService } from 'src/modules/config/app-config.service';
import { Order } from '../orders/entities/order.entity';

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
      refresh_token: this.appConfigService.googleToken.replace(/\\n/g, '\n'),
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
      host: 'smtp.gmail.com',
      auth: {
        type: 'OAuth2',
        user: 'legood.noreply@gmail.com',
        clientId: this.appConfigService.googleClientId.replace(/\\n/g, '\n'),
        clientSecret: this.appConfigService.googleClientSecret.replace(
          /\\n/g,
          '\n',
        ),
        accessToken,
      },
    };
    this.mailerService.addTransporter('gmail', config);
  }

  public async sendOTPMail(email: string, code: string): Promise<boolean> {
    await this.setTransport();
    return this.mailerService.sendMail({
      transporterName: 'gmail',
      to: email,
      subject: 'Verification Code - Legood Store',
      template: './otp',
      context: {
        code: code,
      },
    });
  }

  public async sendOrderMail(email: string, order: Order): Promise<boolean> {
    await this.setTransport();
    return this.mailerService
      .sendMail({
        transporterName: 'gmail',
        to: email,
        subject: `Order #${order.id} - Legood Store`,
        template: './order',
        context: {
          orderId: order.id,
          address: order.address.address,
          orderStatus: order.orderStatus,
          totalValue: order.amount,
          products: order.orderDetails,
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
