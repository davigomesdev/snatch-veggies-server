import { Module } from '@nestjs/common';
import { JsonFileService } from './json-file.service';

@Module({
  imports: [],
  providers: [JsonFileService],
  exports: [JsonFileService],
})
export class JsonFileModule {}
