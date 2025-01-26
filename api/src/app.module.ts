import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import configuration from './config/configuration';
import { EnvironmentVariables } from './config/environment-variables';
import { StudantModule } from './student/student.module';
import { TracingModule } from './tracing/tracing.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: configuration().database.host,
      port: configuration().database.port,
      username: configuration().database.username,
      password: configuration().database.password,
      database: configuration().database.database,
      entities: [__dirname + '/**/*.entity.{js,ts}'],
      synchronize: false, // NÃO use `synchronize: true` em produção!
      logging: false,
    }),
    ConfigModule.forRoot({
      ignoreEnvFile: true, // Não carregar .env
      isGlobal: true,
      cache: false,
      load: [configuration],
      validate: (config) =>
        plainToClass(EnvironmentVariables, config, {
          enableImplicitConversion: false,
        }),
    }),
    TracingModule,
    StudantModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
