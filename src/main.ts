import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

const logger = new Logger('bootstrap');

const PORT = process.env.PORT || 3001;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Ourpass Assessment')
    .setDescription('The Ourpass Assessment API description')
    .setVersion('1.0')
    .addTag('tutorsPoint')
    .addBearerAuth(
      {
        description: 'Provide jwt issued by Ourpass Assessment',
        bearerFormat: 'JWT',
        scheme: 'Bearer',
        type: 'http',
        in: 'Header',
      },
      'JWT',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(PORT, async () => {
    logger.log(`Application is running on: ${await app.getUrl()}`);
  });
}
bootstrap();
