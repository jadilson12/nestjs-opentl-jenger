import { Global, Module, OnModuleInit } from '@nestjs/common';
import { LogListenerService } from './log-listener.service';
import { TracingService } from './tracing.service';

@Global()
@Module({
  providers: [TracingService, LogListenerService],
  exports: [TracingService],
})
export class TracingModule implements OnModuleInit {
  constructor(private readonly tracingService: TracingService) {}

  async onModuleInit() {
    await this.tracingService.initializeTracing();
  }
}
