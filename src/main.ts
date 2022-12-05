import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import { config } from 'process';
import { AppModule } from './app.module';
import { configSwagger } from './config-swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  configSwagger(app);

  await app.listen(3000);
}
bootstrap();
