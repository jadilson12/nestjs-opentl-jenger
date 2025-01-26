import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { diag, DiagConsoleLogger, DiagLogLevel } from '@opentelemetry/api';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-grpc';
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';
import { NestInstrumentation } from '@opentelemetry/instrumentation-nestjs-core';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { TypeormInstrumentation } from 'opentelemetry-instrumentation-typeorm';

@Injectable()
export class TracingService {
  private readonly logger = new Logger(TracingService.name);
  constructor(private config: ConfigService) {}

  async initializeTracing() {
    this.logger.log('Tracing initialized');
    diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.ERROR);

    const traceExporter = new OTLPTraceExporter({
      url: this.config.get('OTEL_EXPORTER_OTLP_ENDPOINT'),
    });
    const sdk = new NodeSDK({
      serviceName: this.config.get('SERVICE_NAME'),

      spanProcessor: new BatchSpanProcessor(traceExporter, {
        maxQueueSize: 100, // Tamanho máximo da fila
        scheduledDelayMillis: 500, // Intervalo em milissegundos para enviar traces
      }),
      instrumentations: [
        new HttpInstrumentation(),
        new TypeormInstrumentation(),
        new NestInstrumentation({
          enabled: true,
        }),
      ],
    });

    process.on('beforeExit', async () => {
      this.logger.log('Shutting down');
      await sdk.shutdown();
    });

    return sdk.start();
  }
}
