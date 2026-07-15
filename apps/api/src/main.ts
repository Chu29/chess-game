import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // TEMPORARY — dev-only wide-open CORS so the mobile app (on your LAN IP,
  // not localhost) can hit the API. Restrict `origin` to your real app's
  // domain before this ever goes to production.
  app.enableCors({
    origin: true,
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
