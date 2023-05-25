import { Injectable } from '@nestjs/common';
import { UploadApiResponse, v2 } from 'cloudinary';
import toStream = require('buffer-to-stream');
import { AppConfigService } from 'src/modules/config/app-config.service';

const FILE_LIMITS = 10000000; // 10MB

@Injectable()
export class CloudinaryService {
  constructor(appConfigService: AppConfigService) {
    v2.config({
      cloud_name: appConfigService.cloudinaryCloudName,
      api_key: appConfigService.cloudinaryApiKey,
      api_secret: appConfigService.cloudinaryApiSecret,
    });
  }

  uploadImage(file: Express.Multer.File): Promise<UploadApiResponse> {
    if (file.size > FILE_LIMITS) {
      throw new Error('Please upload a file size not more than 10MB');
    }

    if (!file.mimetype.startsWith('image')) {
      throw new Error('Sorry, this file is not an image, please try again');
    }

    return new Promise((resolve, reject) => {
      const upload = v2.uploader.upload_stream((error, result) => {
        if (error) return reject(error);
        resolve(result);
      });

      toStream(file.buffer).pipe(upload);
    });
  }
}
