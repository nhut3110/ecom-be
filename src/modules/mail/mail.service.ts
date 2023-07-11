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
        user: 'noreply.fakestore@gmail.com',
        clientId: this.appConfigService.googleClientId,
        clientSecret: this.appConfigService.googleClientSecret,
        accessToken,
      },
    };
    this.mailerService.addTransporter('gmail', config);
  }

  public async sendOTPMail(email: string, code: string): Promise<boolean> {
    await this.setTransport();
    return this.mailerService
      .sendMail({
        transporterName: 'gmail',
        to: email,
        subject: 'Verification Code - Fake Store',
        template: './otp',
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

  public async sendOrderMail(email: string, order: Order): Promise<boolean> {
    await this.setTransport();
    return this.mailerService
      .sendMail({
        transporterName: 'gmail',
        to: email,
        subject: `Order #${order.id} - Fake Store`,
        template: './order',
        context: {
          orderId: order.id,
          address: order.address.address,
          orderStatus: order.orderStatus,
          totalValue: order.orderDetails.reduce(
            (total, item) => total + item.product.price * item.quantity,
            0,
          ),
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
