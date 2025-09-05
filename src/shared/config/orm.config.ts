import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

export const ormConfig = (config: ConfigService): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: config.get<string>('DB_HOST'),
  port: parseInt(config.get('DB_PORT') ?? '5432', 10),
  username: config.get<string>('DB_USER'),
  password: config.get<string>('DB_PASS'),
  database: config.get<string>('DB_NAME'),
  autoLoadEntities: true,
  synchronize: false,
  migrationsRun: false,
  logging: false,
  ssl:
    (config.get<string>('DB_SSL') ?? 'false') === 'true'
      ? { rejectUnauthorized: false }
      : false,
});
