import { Injectable, Logger, OnModuleInit } from '@nestjs/common';

import * as events from 'events';

import * as os from 'os';
import * as path from 'path';
import * as fs from 'fs';
import * as readline from 'readline';
import { CustomEmitter, EVENT_NAMES } from './CustomEmitter';
import { error } from 'console';

@Injectable()
export class FileProcessingService implements OnModuleInit {
  readonly folderToRead: string;
  readonly folderToWrite: string;
  readonly logger = new Logger('FileProcessingService');

  constructor() {
    this.folderToRead = path.join(os.tmpdir(), 'readFiles');
    this.folderToWrite = path.join(os.tmpdir(), 'writeFiles');

    this.logger.debug(
      JSON.stringify({
        folderToRead: this.folderToRead,
        folderToWrite: this.folderToWrite,
      }),
    );
    this.initFolders();
  }
  async onModuleInit() {
    this.logger.log('onModuleInit');
    await this.tests();
  }

  private async tests() {
    this.logger.log('tests');
    const pathTestFile = path.join(this.folderToRead, 'test.csv');
    const pathTestFile2 = path.join(this.folderToRead, 'test2.csv');
    // !fs.existsSync(pathTestFile) && (await this.createTestFile(pathTestFile));

    await Promise.all([
      this.readFile(pathTestFile),
      this.readFile(pathTestFile2),
    ]);
  }

  private initFolders() {
    this.logger.log('initFolders');

    const existsReadFolder = fs.existsSync(this.folderToRead),
      existsWriteFolder = fs.existsSync(this.folderToWrite);

    !existsReadFolder && fs.mkdirSync(this.folderToRead);
    !existsWriteFolder && fs.mkdirSync(this.folderToWrite);
  }

  private async createTestFile(pathTestFile: string) {
    this.logger.log('createTestFile');
    const testFile = fs.createWriteStream(pathTestFile);

    testFile.on('error', (error) => {
      this.logger.log('testFile on error');
      this.logger.error(JSON.stringify(error));
    });
    testFile.on('drain', () => {
      this.logger.log('testFile on drain');
    });
    testFile.on('finish', () => {
      this.logger.log('testFile on finish');
    });

    testFile.write(`id,text`, 'utf-8');
    for (let i = 0; i < 5000; i++) {
      if (!testFile.write(`${i},text ${i}-${i * 10}\n`, 'utf-8')) {
        await events.once(testFile, 'drain');
      }
    }
    this.logger.log('Writing finished');
    testFile.end();
  }

  private readFile(pathFile: string) {
    this.logger.log('readFile');
    return new Promise((resolve, rejects) => {
      const readStream = fs.createReadStream(pathFile);

      const rl = readline.createInterface({
        input: readStream,
      });

      // const customEmitter = CustomEmitter.getNewCustomEmitter(this.logger);
      const customEmitter = new CustomEmitter(this.logger);

      customEmitter.on('error', () => {
        rejects(error);
      });

      this.logMemoryUsage();

      rl.on('line', (input) => {
        //   this.logger.log('readLine.on.line');
        //   this.logMemoryUsage();
        customEmitter.emit(EVENT_NAMES.newLine, input);

        // this.logMemoryUsage();
      });

      rl.on('error', (error) => {
        // this.logger.error(JSON.stringify(error));
        // this.logger.debug(rl.line);
        rejects(error);
      });

      rl.on('close', () => {
        this.logger.log('readLine.on.close');
        customEmitter.emit(EVENT_NAMES.validateExecuteAllChunks);
      });

      customEmitter.on(EVENT_NAMES.completeExecution, () => {
        this.logger.log(`customEmitter.${EVENT_NAMES.completeExecution}`);
        resolve(true);
      });
    });
  }

  private logMemoryUsage() {
    const { heapTotal, heapUsed, rss, arrayBuffers } = process.memoryUsage();

    this.logger.debug(
      JSON.stringify({
        heapTotal: this.transformToMB(heapTotal),
        heapUsed: this.transformToMB(heapUsed),
        rss: this.transformToMB(rss),
        arrayBuffers: this.transformToMB(arrayBuffers),
      }),
    );
  }

  private transformToMB(value: number): string {
    return `${((value / 1024 / 1024) * 100) / 100} MB`;
  }
}
