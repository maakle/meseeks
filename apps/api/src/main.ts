import { VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Enable CORS
  app.enableCors({
    origin: [
      'http://localhost:3000', // Next.js development server
      'http://localhost:3001', // API server (for testing)
      process.env.FRONTEND_URL, // Production frontend URL
    ].filter((url): url is string => Boolean(url)),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  });

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Meseeks API')
    .setDescription('The Meseeks API documentation')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);

  app.use(
    '/reference',
    apiReference({
      content: document,
    }),
  );

  app.useStaticAssets(join(__dirname, '..', 'generatedImages'));
  app.useStaticAssets(join(__dirname, '..', 'audioFile'));
  await app.listen(3001);
}
bootstrap();
