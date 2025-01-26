import { Injectable, Logger, LoggerService } from '@nestjs/common';
import { Span, context, trace } from '@opentelemetry/api';

@Injectable()
export class OtelLoggerService implements LoggerService {
  private readonly nestLogger = new Logger(); // Instância padrão do NestJS Logger

  log(message: any, ...optionalParams: any[]) {
    this.nestLogger.log(message, ...optionalParams); // Mantém o comportamento padrão
    this.addLogToSpan('log', message, optionalParams);
  }

  error(message: any, traceInfo?: string, ...optionalParams: any[]) {
    this.nestLogger.error(message, traceInfo, ...optionalParams); // Mantém o comportamento padrão
    this.addLogToSpan('error', message, optionalParams, traceInfo);
  }

  warn(message: any, ...optionalParams: any[]) {
    this.nestLogger.warn(message, ...optionalParams); // Mantém o comportamento padrão
    this.addLogToSpan('warn', message, optionalParams);
  }

  debug(message: any, ...optionalParams: any[]) {
    this.nestLogger.debug(message, ...optionalParams); // Mantém o comportamento padrão
    this.addLogToSpan('debug', message, optionalParams);
  }

  verbose(message: any, ...optionalParams: any[]) {
    this.nestLogger.verbose(message, ...optionalParams); // Mantém o comportamento padrão
    this.addLogToSpan('verbose', message, optionalParams);
  }

  private addLogToSpan(
    level: string,
    message: any,
    optionalParams: any[],
    traceInfo?: string,
  ) {
    const currentContext = context.active();
    const span: Span | undefined = trace.getSpan(currentContext);

    if (span) {
      span.addEvent('log', {
        level,
        message:
          typeof message === 'string' ? message : JSON.stringify(message),
        trace: traceInfo,
        optionalParams: optionalParams.length
          ? JSON.stringify(optionalParams)
          : undefined,
      });
    }
  }
}
