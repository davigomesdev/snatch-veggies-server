import { TBlockSetter } from '@core/types/block-setter';

import { NotFoundError } from '@domain/errors/not-found-error';
import { BadRequestError } from '@domain/errors/bad-request-error';

import { join } from 'path';

import * as fs from 'fs';
import * as lockfile from 'proper-lockfile';

import { Injectable } from '@nestjs/common';

@Injectable()
export class JsonFileService {
  private readonly dataDirectory: string;

  public constructor() {
    this.dataDirectory = join(__dirname, '..', '..', '..', 'data');
  }

  private path(fileName: string): string {
    return join(this.dataDirectory, `${fileName}.json`);
  }

  public getFile(fileName: string): TBlockSetter[][] {
    try {
      const filePath = this.path(fileName);

      if (!fs.existsSync(filePath)) {
        throw new NotFoundError(`File ${fileName} not found.`);
      }

      const fileContent = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(fileContent);
    } catch (error) {
      throw new NotFoundError(`Error reading file ${fileName}`);
    }
  }

  public createFile(fileName: string, data: any): void {
    try {
      const filePath = this.path(fileName);

      if (fs.existsSync(filePath)) {
        throw new BadRequestError(`File ${fileName} already exists.`);
      }

      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    } catch (error) {
      throw new BadRequestError(`Failed to create file ${fileName}`);
    }
  }

  public updateFile(fileName: string, updatedData: TBlockSetter[][]): void {
    try {
      const filePath = this.path(fileName);

      const release = lockfile.lockSync(filePath, {
        stale: 10000,
        update: 5000,
        onCompromised: (err) => {
          throw new BadRequestError(`Lock compromised: ${err.message}`);
        },
      });

      try {
        const tempFilePath = `${filePath}.tmp`;
        fs.writeFileSync(tempFilePath, JSON.stringify(updatedData, null, 2));
        fs.renameSync(tempFilePath, filePath);
      } finally {
        release();
      }
    } catch (error) {
      throw new BadRequestError(`Failed to update file ${fileName}.`);
    }
  }
}
