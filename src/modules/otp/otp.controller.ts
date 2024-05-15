import {
  Controller,
  Get,
  Post,
  Body,
  UnauthorizedException,
  BadRequestException,
  Param,
  Query,
} from '@nestjs/common';
import { OtpService } from './otp.service';
import { MailService } from '../mail/mail.service';
import { OtpDto } from './dto/otp.dto';
import { DEFAULT_OTP_TYPE, OtpTypes } from './otp.constant';

@Controller('otp')
export class OtpController {
  constructor(
    private readonly otpService: OtpService,
    private readonly mailService: MailService,
  ) {}

  @Get(':email')
  async get(
    @Param('email') email: string,
    @Query('type') type?: OtpTypes,
  ): Promise<boolean> {
    if (!type) type = DEFAULT_OTP_TYPE;

    const isValidRequest = await this.otpService.isValidOtpRequest(email, type);
    if (!isValidRequest) throw new BadRequestException('Invalid OTP request');

    const otp = this.otpService.generateOtp();
    await this.otpService.storeOtp(email, otp, type);

    return await this.mailService.sendOTPMail(email, otp);
  }

  @Post(':email')
  async post(
    @Param('email') email: string,
    @Body() body: OtpDto,
    @Query('type') type?: OtpTypes,
  ): Promise<boolean> {
    if (!type) type = DEFAULT_OTP_TYPE;

    const isValidOtp = await this.otpService.validateAndRemoveOtp({
      email,
      otp: body.otp,
      type,
    });

    if (!isValidOtp) throw new BadRequestException('Invalid OTP');

    await this.otpService.revokeOtp(email, type);

    return isValidOtp;
  }
}
