// Logger.ts
import chalk from "chalk";

type LogLevel = 'info' | 'debug';

interface LoggerOptions {
  enabledLevels?: LogLevel[];
}

export class Logger {
  private enabledLevels: Set<LogLevel>;
  private prependNewline = false;

  constructor(options?: LoggerOptions) {
    this.enabledLevels = new Set(options?.enabledLevels || ['info', 'debug']);
  }

  private getTimestamp(): string {
    const now = new Date();
    return chalk.dim(now.toTimeString().split(' ')[0]);  // "HH:MM:SS"
  }

  private shouldLog(level: LogLevel): boolean {
    return this.enabledLevels.has(level);
  }

  private addTimestampTo(message: string): string {
    let result: string;

    if (this.prependNewline) {
      result = `\n${this.getTimestamp()} ${message}`;
    }else {
      result = `${this.getTimestamp()} ${message}`;
    }

    this.prependNewline = false;
    return result;
  }

  log(message: string, ...args: unknown[]): void {
    if (this.shouldLog('info')) {
    console.info(this.addTimestampTo(message), ...args);
    }
  }

  debug(message: string, ...args: unknown[]): void {
    if (this.shouldLog('debug')) {
      console.debug(this.addTimestampTo(message), ...args);
    }
  }

  warn(message: string, ...args: unknown[]): void {
    console.warn(this.addTimestampTo(chalk.bgYellow.bold.white(message)), ...args);
  }

  error(message: string, ...args: unknown[]): void {
    console.error(this.addTimestampTo(chalk.bgRed.bold.white(message)), ...args);
  }

  setEnabledLevels(levels: LogLevel[]): void {
    this.enabledLevels = new Set(levels);
  }

  newline(msg?: string, ...args: unknown[]): Logger {
    this.prependNewline = true;

    if (msg !== undefined) {
      this.log(msg, ...args)
    }

    return this;
  }
}

export default new Logger({
  enabledLevels: ['info']
});
