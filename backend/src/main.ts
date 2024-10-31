import { NestFactory } from "@nestjs/core";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";

import { AppModule } from "./app.module";
import { CustomHttpExceptionFilter } from "./utils/catch";
import metadata from "./metadata";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle("Zigship API")
    .setDescription("The Zigship API description")
    .setVersion("1.0")
    .build();
  await SwaggerModule.loadPluginMetadata(metadata);
  const document = SwaggerModule.createDocument(app, config, {
    operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
    deepScanRoutes: true,
  });
  SwaggerModule.setup("docs", app, document, {
    jsonDocumentUrl: "docs/json",
  });
  app.enableCors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true,
  });
  app.useGlobalFilters(new CustomHttpExceptionFilter());
  await app.listen(parseInt(process.env.PORT, 10) || 3000);
}
bootstrap();
