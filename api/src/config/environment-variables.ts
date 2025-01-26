import { IsNumberString, IsString } from 'class-validator';

export class EnvironmentVariables {
  @IsNumberString()
  PORT: string;

  @IsString()
  DATABASE_URL: string;

  @IsString()
  JWT_SECRET: string;
}
