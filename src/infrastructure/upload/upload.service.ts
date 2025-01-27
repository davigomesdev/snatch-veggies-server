import { Injectable } from '@nestjs/common';
import { File } from '@nest-lab/fastify-multer';

import { join } from 'path';
import { promises as fs } from 'fs';
import { BadRequestError } from '@domain/errors/bad-request-error';

@Injectable()
export class UploadService {
  public async saveFile(file: File, destinationPath: string): Promise<string> {
    const uploadsPath = join(process.cwd(), 'uploads', destinationPath);

    const filename = `${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`;
    const filePath = join(uploadsPath, filename);

    await fs.writeFile(filePath, file.buffer);

    return filename;
  }

  public async saveFiles(file: File[], destinationPath: string): Promise<string[]> {
    const uploadsPath = join(process.cwd(), 'uploads', destinationPath);
    const savedFiles: string[] = [];

    for (const image of file) {
      const filename = `${Date.now()}-${image.originalname.replace(/\s+/g, '-')}`;
      const filePath = join(uploadsPath, filename);

      await fs.writeFile(filePath, image.buffer);
      savedFiles.push(filename);
    }

    return savedFiles;
  }

  public async removeFile(filename: string, destinationPath: string): Promise<void> {
    const filePath = join(process.cwd(), 'uploads', destinationPath, filename);

    try {
      await fs.unlink(filePath);
    } catch (error) {
      throw new BadRequestError(`Erro ao remover o arquivo: ${filename}`);
    }
  }

  public async removeAll(filenames: string[], destinationPath: string): Promise<void> {
    const uploadsPath = join(process.cwd(), 'uploads', destinationPath);

    for (const filename of filenames) {
      const filePath = join(uploadsPath, filename);

      try {
        await fs.unlink(filePath);
      } catch (error) {
        throw new BadRequestError(`Erro ao remover o arquivo: ${filename}`);
      }
    }
  }
}
