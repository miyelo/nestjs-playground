import { Module } from '@nestjs/common';
import { FileProcessingService } from './FileProcessing.service';

@Module({
  providers: [FileProcessingService],
  exports: [FileProcessingService],
})
export class FileProcessingModule {}
