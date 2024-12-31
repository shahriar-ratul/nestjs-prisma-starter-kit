import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { config as dotenvConfig } from "dotenv";
import {
  Logger,
  RequestMethod,
  ValidationPipe,
  VERSION_NEUTRAL,
  VersioningType,
} from "@nestjs/common";
import { join } from "path";

import * as cookieParser from "cookie-parser";

import * as bodyParser from "body-parser";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { NestExpressApplication } from "@nestjs/platform-express";

import { Request, Response, NextFunction } from "express";

async function bootstrap() {
  // Load environment variables from .env file
  dotenvConfig();

  const logger = new Logger();

  const port = process.env.PORT || 4000;

  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bodyParser: false,
  });

  app.enableCors({
    origin: "*",
  });

  const publicPath = join(process.cwd(), "public");

  app.useStaticAssets(publicPath, {
    prefix: "/public/",
  });

  app.use(cookieParser());
  app.use(bodyParser.json({ limit: "2048mb" }));
  app.use(bodyParser.urlencoded({ limit: "2048mb", extended: true }));

  app.setGlobalPrefix("api", {
    exclude: [
      { path: "/", method: RequestMethod.GET },
      { path: "docs", method: RequestMethod.GET },
      { path: "public/*", method: RequestMethod.GET },
    ],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidUnknownValues: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Enable trust for the proxy
  app.getHttpAdapter().getInstance().set("trust proxy", true);

  // Versioning
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: VERSION_NEUTRAL,
  });

  // Swagger
  const config = new DocumentBuilder()
    .setTitle("API Documentation")
    .setDescription("API description")
    .setVersion("1.0")
    .addTag("docs")
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("docs", app, document);

  // Etag
  app.set("etag", false);

  app.use((req: Request, res: Response, next: NextFunction) => {
    res.removeHeader("x-powered-by");
    res.removeHeader("date");

    next();
  });

  logger.log(`Server running on http://localhost:${port}`);

  await app.listen(port);
}
bootstrap();
