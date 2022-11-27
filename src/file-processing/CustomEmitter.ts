import { Logger } from '@nestjs/common';
import { EventEmitter } from 'events';

export enum EVENT_NAMES {
  'error' = 'error',
  'newLine' = 'newLine',
  'reachChunkLimit' = 'reachChunkLimit',
  'validateExecuteAllChunks' = 'validateExecuteAllChunks',
  'finishAllChunkProcess' = 'finishAllChunkProcess',
  'completeExecution' = 'completeExecution',
}

export class CustomEmitter extends EventEmitter {
  logger: Logger;
  currentNewLines: string[] = [];
  matrixOfNewLines: string[][] = [];
  arrayTerminated: number[] = [];
  private maximunLinesCap: number;

  constructor(logger: Logger, maximunLinesCap?: 100) {
    super();
    this.logger = logger;
    this.maximunLinesCap = maximunLinesCap;

    this.on(EVENT_NAMES.newLine, (newLine: string) => {
      //   customEmitter.logger.log(EVENT_NAMES.newLine);
      //   customEmitter.logger.debug(newLine);

      this.currentNewLines.push(newLine);
      if (this.currentNewLines.length === this.maximunLinesCap) {
        this.emit(
          EVENT_NAMES.reachChunkLimit,
          this.currentNewLines.slice(), // clone vector of currentNewLines
          this.matrixOfNewLines.length, // row of the matrix
        );

        this.currentNewLines = [];
      }
    });

    this.on(
      EVENT_NAMES.reachChunkLimit,
      (linesOfString: string[], index: number) => {
        // customEmitter.logger.log(EVENT_NAMES.reachChunkLimit);
        // customEmitter.logger.debug(linesOfString);

        this.matrixOfNewLines.push(linesOfString);

        const secondsToWait = getRandomNumber(60, 1);
        const milisecondsToWait = secondsToWait * 1000;

        console.log(
          `Sending information index:${index} ETA ${secondsToWait} seconds`,
        );
        logMemoryUsage();
        setTimeout(() => {
          console.log(
            `Information sended index:${index} ETA:${secondsToWait} seconds`,
          );
          this.arrayTerminated.push(index);
          this.matrixOfNewLines[index] = [];
          this.emit(EVENT_NAMES.validateExecuteAllChunks);
          logMemoryUsage();
        }, milisecondsToWait);
      },
    );

    this.on(EVENT_NAMES.validateExecuteAllChunks, () => {
      const totalOfChunks = this.matrixOfNewLines.length;

      if (totalOfChunks === this.arrayTerminated.length) {
        this.emit(EVENT_NAMES.finishAllChunkProcess);
      }
    });

    this.on(EVENT_NAMES.finishAllChunkProcess, () => {
      const secondsToWait = getRandomNumber(60, 1) * 1000;

      console.log(
        `Sending currentNewLines information length:${this.currentNewLines.length
        } ETA:${secondsToWait / 1000}`,
      );
      setTimeout(() => {
        console.log(
          `Information currentNewLines sended length:${this.currentNewLines.length
          } ETA:${secondsToWait / 1000}`,
        );
        this.emit(EVENT_NAMES.completeExecution);
        logMemoryUsage();
      });
    });
  }

  getTotalOfLines() {
    let totalCount = 0;
    for (const array in this.matrixOfNewLines) {
      totalCount += array.length;
    }
    totalCount += this.currentNewLines.length;

    return totalCount;
  }
}

function getRandomNumber(max, min) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function logMemoryUsage() {
  const { heapTotal, heapUsed, rss, arrayBuffers } = process.memoryUsage();

  console.debug(
    JSON.stringify({
      heapTotal: transformToMB(heapTotal),
      heapUsed: transformToMB(heapUsed),
      rss: transformToMB(rss),
      arrayBuffers: transformToMB(arrayBuffers),
    }),
  );
}

function transformToMB(value: number): string {
  return `${((value / 1024 / 1024) * 100) / 100} MB`;
}
