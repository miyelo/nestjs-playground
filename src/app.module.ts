import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FileProcessingModule } from './file-processing/FileProcessing.module';

@Module({
  imports: [FileProcessingModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
