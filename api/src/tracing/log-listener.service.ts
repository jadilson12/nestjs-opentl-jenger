import { Global, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { context, Span, trace } from '@opentelemetry/api';

@Global()
@Injectable()
export class LogListenerService implements OnModuleInit {
  private readonly logger = new Logger('LogListener');

  onModuleInit() {
    const originalLog = this.logger.log.bind(this.logger);

    // Sobrescreve o método `log`
    this.logger.log = (message: string, contextName?: string) => {
      // Obtém o contexto ativo
      const currentContext = context.active(); // Verifica se o Context Manager está configurado
      const span: Span | undefined = trace.getSpan(currentContext);

      if (span) {
        span.addEvent('log', {
          message,
          context: contextName,
        });
      }

      // Executa o comportamento original
      originalLog(message, contextName);
    };
  }
}
