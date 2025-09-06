import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ormConfig } from './shared/config/orm.config';
import { TeacherMoodule } from './teacher/teacher.module';
import { ReferenceModule } from './reference/reference.module';
import { ParentModule } from './parent/parent.module';
import { AuthModule } from './shared/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`.env.${process.env.NODE_ENV}`, '.env'],
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ormConfig(config),
    }),
    AuthModule,
    ParentModule,
    TeacherMoodule,
    ReferenceModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
