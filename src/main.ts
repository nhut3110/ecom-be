import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AppConfigService } from './modules/config/app-config.service';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    abortOnError: false,
  });

  app.set('trust proxy', 1);

  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('Legood API')
    .setDescription('Below are routes supported by Legood APIs')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const appConfigService = app.get(AppConfigService);

  const port = process.env.PORT || appConfigService.port || 3000;
  await app.listen(port);
}
bootstrap();
