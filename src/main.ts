import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { SecuritySchemeObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { stringify } from 'yaml';
import * as fs from 'fs';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  const JWTOptionsObject: SecuritySchemeObject = {
    type: 'http',
    scheme: 'bearer',
    bearerFormat: 'JWT',
    name: 'JWT',
    description: 'Enter JWT token',
    in: 'header',
  };

  const configService = app.get(ConfigService);

  if (configService.get('NODE_ENV') == 'development') {
    // Swagger configuration
    const swaggerConfig = new DocumentBuilder()
      .setTitle('OnlineStoreAPI')
      .setDescription('Simple backend for online stores')
      .setVersion('1.0.0')
      .addBearerAuth(JWTOptionsObject, 'JWT-auth')
      .addBearerAuth(JWTOptionsObject, 'JWT-refresh')
      .build();

    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('/api/docs', app, document, {
      customSiteTitle: 'OnlineStoreAPI documentation',
    });

    const yamlString: string = stringify(document, {});
    fs.writeFileSync('./swagger.yaml', yamlString);
  }

  await app.listen(3000);
}

bootstrap();
