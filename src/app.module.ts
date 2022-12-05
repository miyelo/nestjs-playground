import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FileProcessingModule } from './file-processing/FileProcessing.module';
import { GenericsModule } from './generics/generics.module';

@Module({
  imports: [FileProcessingModule, GenericsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
