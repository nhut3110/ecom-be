import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { AxiosError } from 'axios';

@Injectable()
export class ProxyService {
  private readonly logger = new Logger(ProxyService.name);

  constructor(private httpService: HttpService) {}

  async fetchImage(url: string): Promise<Buffer> {
    try {
      const response = await lastValueFrom(
        this.httpService.get(url, {
          responseType: 'arraybuffer',
          headers: {
            'User-Agent':
              'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36',
            Accept:
              'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.9',
            Referer: 'https://www.brickset.com/',
            Origin: 'https://www.brickset.com',
          },
        }),
      );
      return Buffer.from(response.data);
    } catch (error) {
      const axiosError = error as AxiosError;
      this.logger.error(
        `Failed to download the image: ${axiosError.message}`,
        axiosError.stack,
      );
      throw new Error(
        `Failed to download the image: ${axiosError.response?.statusText}`,
      );
    }
  }
}
