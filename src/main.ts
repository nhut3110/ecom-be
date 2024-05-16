import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AppConfigService } from './modules/config/app-config.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { abortOnError: false });

  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('Legood API')
    .setDescription('Below are routes supported by Legood APIs')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const appConfigService = app.get(AppConfigService);
  // await app.listen(appConfigService.port);
  // await app.listen(3000);
  const port = process.env.PORT || 3000;
  await app.listen(port);
}
bootstrap();
