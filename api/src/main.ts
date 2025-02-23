import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { SeedService } from './student/seed.service';
import { TracingInterceptor } from './tracing/tracing.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Registrar o interceptor global de tracing
  app.useGlobalInterceptors(new TracingInterceptor());

  const seedService = app.get(SeedService);
  await seedService.seedDatabase();
  await app.listen(8080);
}
bootstrap();
