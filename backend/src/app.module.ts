import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { join } from "path";
import { ServeStaticModule } from "@nestjs/serve-static";
import { ConfigModule, ConfigService } from "@nestjs/config";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";

import { UsersModule, ClientsModule } from "./entities/";

import config from "./config/configuration";

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ".env",
      isGlobal: true,
      load: [config],
      cache: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, "..", "public"),
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        ...configService.get("database.options"),
        uri: configService.get<string>("database.uri"),
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    AuthModule,
    ClientsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
