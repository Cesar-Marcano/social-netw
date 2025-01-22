import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const { httpAdapter } = app.get(HttpAdapterHost);
  httpAdapter.getInstance().disable('x-powered-by');

  app.useGlobalPipes(new ValidationPipe());
  
  await app.listen(process.env['PORT'] ?? 3000);
}
bootstrap();
