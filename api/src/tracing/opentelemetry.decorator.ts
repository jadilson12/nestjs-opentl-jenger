import { context as otelContext, trace } from '@opentelemetry/api';

export function Trace(spanName?: string): MethodDecorator {
  return (target, propertyKey, descriptor: TypedPropertyDescriptor<any>) => {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const tracer = trace.getTracer('app-tracer');
      const parentContext = otelContext.active(); // Contexto ativo do OpenTelemetry
      const spanNameToUse =
        spanName || `${target.constructor.name}.${String(propertyKey)}`;
      const span = tracer.startSpan(spanNameToUse, {}, parentContext);

      try {
        // Executa o método original dentro do contexto do span
        return await otelContext.with(
          trace.setSpan(parentContext, span),
          async () => {
            const result = await originalMethod.apply(this, args);
            span.setAttribute('result', JSON.stringify(result));
            return result;
          },
        );
      } catch (error) {
        // Captura erros no span
        span.recordException(error);
        throw error;
      } finally {
        // Finaliza o span
        span.end();
      }
    };

    return descriptor;
  };
}
