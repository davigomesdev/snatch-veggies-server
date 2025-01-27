import { BadRequestError } from '@domain/errors/bad-request-error';

import multer from 'fastify-multer';
import { FastifyRequest } from 'fastify';

import { Options, StorageEngine, FileFilterCallback, File } from '@nest-lab/fastify-multer';

export class UploadConfig {
  public static role(): Options {
    const storage: StorageEngine = multer.memoryStorage();

    const fileFilter = (_req: FastifyRequest, file: File, cb: FileFilterCallback): void => {
      if (!file.mimetype.startsWith('image/')) {
        return cb(new BadRequestError('File type not allowed. Only images are accepted.'), false);
      }
      cb(null, true);
    };

    return {
      storage,
      limits: {
        fileSize: 20 * 1024 * 1024,
      },
      fileFilter,
    };
  }
}
