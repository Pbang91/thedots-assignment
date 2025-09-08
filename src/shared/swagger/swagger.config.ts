import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export const setupSwagger = (app: INestApplication) => {
  const options = new DocumentBuilder()
    .setTitle('선생님 추천 API')
    .setDescription('사전과제 설명을 위한 API 문서입니다')
    .setVersion('1.0.0')
    .addBearerAuth()
    .addTag('RecommendationQuery', '선생님 추천 관련 Query API 설명서입니다')
    .build();

  const document = SwaggerModule.createDocument(app, options);

  SwaggerModule.setup('docs', app, document);
};
