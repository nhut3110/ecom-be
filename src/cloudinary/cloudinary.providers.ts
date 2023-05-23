import { v2 } from 'cloudinary';
import { CLOUDINARY } from 'src/constants';
import { AppConfigModule } from 'src/modules/config/app-config.module';
import { AppConfigService } from 'src/modules/config/app-config.service';

export const CloudinaryProvider = {
  provide: CLOUDINARY,
  imports: [AppConfigModule],
  useFactory: async (appConfigService: AppConfigService) => {
    return v2.config({
      cloud_name: appConfigService.cloudinaryCloudName,
      api_key: appConfigService.cloudinaryApikey,
      api_secret: appConfigService.cloudinaryApiSecret,
    });
  },
  inject: [AppConfigService],
};
