import {
  Controller,
  Get,
  Query,
  Res,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { ProxyService } from './proxy.service';
import { Response } from 'express';

@Controller('proxy')
export class ProxyController {
  constructor(private readonly proxyService: ProxyService) {}

  @Get('image')
  async getImage(@Query('url') url: string, @Res() res: Response) {
    if (!url) {
      throw new HttpException('URL is required', HttpStatus.BAD_REQUEST);
    }
    try {
      const imageBuffer = await this.proxyService.fetchImage(url);
      res.set('Content-Type', 'image/jpeg');
      res.send(imageBuffer);
    } catch (error) {
      throw new HttpException('Failed to fetch image', HttpStatus.BAD_GATEWAY);
    }
  }
}
