import { Module } from '@nestjs/common';
import { FastifyMulterModule } from '@nest-lab/fastify-multer';

import { UploadConfig } from './upload.config';
import { UploadService } from './upload.service';

@Module({
  imports: [FastifyMulterModule.register(UploadConfig.role())],
  providers: [UploadService],
  exports: [FastifyMulterModule, UploadService],
})
export class UploadModule {}
