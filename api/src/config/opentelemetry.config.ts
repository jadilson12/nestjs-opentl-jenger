import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';
import { NodeSDK } from '@opentelemetry/sdk-node';
// import { TypeormInstrumentation } from 'opentelemetry-instrumentation-typeorm';

export function initializeOpenTelemetry() {
  const logger = new Logger(initializeOpenTelemetry.name);
  const config = new ConfigService();

  const sdk = new NodeSDK({
    serviceName: config.get('SERVICE_NAME'),
    traceExporter: new OTLPTraceExporter({
      url: config.get('OTEL_EXPORTER_OTLP_ENDPOINT'),
    }),
    instrumentations: [
      new HttpInstrumentation(),
      //  new TypeormInstrumentation()
    ],
  });

  sdk.start();
  logger.log('OpenTelemetry SDK inicializado');

  process.on('SIGTERM', () => {
    sdk
      .shutdown()
      .then(() => logger.log('OpenTelemetry finalizado'))
      .catch((error) => logger.error('Erro ao finalizar OpenTelemetry', error))
      .finally(() => process.exit(0));
  });
}
