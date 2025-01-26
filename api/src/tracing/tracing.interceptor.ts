import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { context as otelContext, Span, trace } from '@opentelemetry/api';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class TracingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const tracer = trace.getTracer('app-tracer');
    const ctxType = context.getType();

    let spanName: string;

    // Nome do span para HTTP (Controller e rota)
    if (ctxType === 'http') {
      const request = context.switchToHttp().getRequest();
      const controllerName = context.getClass().name; // Nome do controller
      const handlerName = context.getHandler().name; // Método chamado
      spanName = `${controllerName} > ${request.method} ${request.url} > ${handlerName}`;
    } else {
      spanName = `${context.getClass().name}.${context.getHandler().name}`;
    }

    // Cria um novo span no contexto ativo
    const parentContext = otelContext.active();
    const span: Span = tracer.startSpan(spanName, {}, parentContext);

    // Configura o contexto com o span atual
    const spanContext = trace.setSpan(parentContext, span);

    return otelContext.with(spanContext, () =>
      next.handle().pipe(
        tap({
          next: (result) => {
            span.setAttribute('result', JSON.stringify(result));
            span.end(); // Fecha o span ao concluir a execução
          },
          error: (error) => {
            span.recordException(error);
            span.end(); // Fecha o span mesmo em caso de erro
          },
        }),
      ),
    );
  }
}
