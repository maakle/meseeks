import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Meseeks API')
    .setDescription('The Meseeks API documentation')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.useStaticAssets(join(__dirname, '..', 'generatedImages'));
  app.useStaticAssets(join(__dirname, '..', 'audioFile'));
  await app.listen(3000);
}
bootstrap();
