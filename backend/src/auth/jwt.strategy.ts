import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { AuthService } from "./auth.service";
import { UserDocument } from "@/interfaces/users.i";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // ExtractJwt.fromAuthHeaderWithScheme("JWT"),
      secretOrKey: configService.get<string>("JWT_SECRET"),
    });
  }
  async validate(payload: any): Promise<UserDocument> {
    const { id, lastPasswordChange } = payload;
    if (!id) {
      throw new UnauthorizedException("Id not found in JWT payload, log in before using this route");
    }
    if (!lastPasswordChange) {
      throw new UnauthorizedException("lastPasswordChange not found in JWT payload, log in before using this route");
    }
    const user = await this.authService.findUser(id);
    if (!user) {
      throw new UnauthorizedException("User not found, or deleted");
    }
    if (!user.login.lastPasswordChange) {
      throw new UnauthorizedException("User lastPasswordChange not found, log in before using this route");
    }
    if (user.status === "banned") {
      throw new UnauthorizedException("User is banned");
    }
    try {
      const date = new Date(lastPasswordChange);
      // the token date must be equal or greater than the last password change date
      if (user.login.lastPasswordChange.getTime() > date.getTime()) {
        throw new UnauthorizedException("Invalid token, password changed after token was issued");
      }
      return user;
    } catch (err) {
      if (err instanceof UnauthorizedException) {
        throw err;
      }
      throw new UnauthorizedException("Invalid token");
    }
  }
}
