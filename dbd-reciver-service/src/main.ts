import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const allowedOrigins = [
    'http://localhost:3001',
    'http://localhost:4000',
    'http://localhost:3002',
    'http://localhost:4001',
    'http://localhost:4003',
    // ✅ เพิ่ม origin นี้เข้ามา
  ];

  app.enableCors({
    origin: (
      origin: string | undefined,
      callback: (error: Error | null, allow?: boolean) => void,
    ) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`Origin ${origin} not allowed by CORS`));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  const port = process.env.PORT ?? 4001;
  await app.listen(port);
  const url = await app.getUrl();
  console.log(`Application is running on: ${url}`);
}

void bootstrap();
