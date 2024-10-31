import { Module } from "@nestjs/common";
import { ClientsService } from "./clients.service";
import { ClientsController } from "./clients.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { ClientSchema, Clients } from "./clients.schema";
import { APP_GUARD } from "@nestjs/core";
import { JwtAuthGuard } from "@/auth/auth.guard";

@Module({
  providers: [ClientsService, { provide: APP_GUARD, useClass: JwtAuthGuard }],
  controllers: [ClientsController],
  imports: [MongooseModule.forFeature([{ name: Clients.name, schema: ClientSchema }])],
  exports: [ClientsService],
})
export class ClientsModule {}
