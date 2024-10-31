import { Module } from "@nestjs/common";
import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";
import { UserSchema, User } from "./users.schema";
import { MongooseModule } from "@nestjs/mongoose";
import { APP_GUARD } from "@nestjs/core";
import { JwtAuthGuard } from "@/auth/auth.guard";
@Module({
  providers: [UsersService, { provide: APP_GUARD, useClass: JwtAuthGuard }],
  controllers: [UsersController],
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
  exports: [UsersService],
})
export class UsersModule {}
