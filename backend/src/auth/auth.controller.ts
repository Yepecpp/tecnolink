import { Body, Controller, Get, HttpCode, HttpException, Post, Req } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { Request } from "express";
import { UserDocument } from "@/interfaces/users.i";
import { Public } from "@utils/decorators";
import { ApiBody, ApiTags } from "@nestjs/swagger";
import { LoginDTO } from "./auth.schema";

@Controller("auth")
@ApiTags("auth")
export class AuthController {
  constructor(
    private authService: AuthService,
    private jwtService: JwtService,
  ) {}
  @Get("/")
  async Auth(@Req() req: Request) {
    const user = await this.authService.findUser((req.user as UserDocument)._id.toString());
    const payload = { id: user._id, lastPasswordChange: user.login.lastPasswordChange.toISOString() };
    return {
      token: this.jwtService.sign(payload),
      user: user.toJSON(),
    };
  }
  @Public()
  @Post("/login")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        login: {
          type: "object",
          properties: {
            username: {
              type: "string",
            },
            password: {
              type: "string",
            },
          },
          required: ["username", "password"],
        },
      },
      required: ["login"],
    },
  })
  @HttpCode(200)
  async LogIn(@Body() body: { login?: LoginDTO }) {
    if (!body.login) {
      throw new HttpException("No login object found in body", 400);
    }
    const user = await this.authService.LogIn(body.login.username);
    if (!user) {
      throw new HttpException("User not found", 404);
    }
    if (user.status === "banned") {
      throw new HttpException("Usuario no puede acceder", 403);
    }
    if (!(await bcrypt.compare(body.login.password, user.login.password))) {
      throw new HttpException("Invalid password", 401);
    }
    const payload = { id: user._id, lastPasswordChange: user.login.lastPasswordChange.toISOString() };
    return {
      token: this.jwtService.sign(payload),
      user: user.toJSON(),
    };
  }
}
