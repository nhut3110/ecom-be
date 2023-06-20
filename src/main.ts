import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AppConfigService } from './modules/config/app-config.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { abortOnError: false });

  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  const config = new DocumentBuilder()
    .setTitle('Backend training')
    .setDescription('The API description')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const appConfigService = app.get(AppConfigService);
  await app.listen(appConfigService.port);
}
bootstrap();
