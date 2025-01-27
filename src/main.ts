import { join } from 'path';

import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { NestFactory } from '@nestjs/core';

import { fastifyCors } from '@fastify/cors';
import fastifyStatic from '@fastify/static';

import { AppModule } from './app.module';
import { applyGlobalConfig } from './global-config';

const bootstrap = async (): Promise<void> => {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());

  app.register(fastifyCors, {
    origin: process.env.CORS_ORIGIN || true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'land-id'],
    credentials: true,
  });

  await app.register(fastifyStatic, {
    root: join(__dirname, '../data'),
    prefix: '/data/',
    cacheControl: true,
    etag: true,
    immutable: true,
    decorateReply: false,
  });

  await app.register(fastifyStatic, {
    root: join(__dirname, '../uploads'),
    prefix: '/uploads/',
    cacheControl: true,
    etag: true,
    immutable: true,
    decorateReply: false,
  });

  app.setGlobalPrefix('api');
  applyGlobalConfig(app);

  await app.listen(process.env.PORT ?? 5000);
};

bootstrap();
