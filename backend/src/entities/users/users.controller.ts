import { Request } from "express";
import { Body, Controller, Get, HttpException, Param, Post, Query, Put, Req, Delete } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

import { IUser, UserDocument, UserRoles, UserZod } from "@interfaces/users.i";
import { UsersService } from "./users.service";
import { Public } from "@/utils/decorators";
import { validateObjectId } from "@utils/mongoose.filter";
import { ApiPaginatedResponse } from "@/decorators";
import { User } from "./users.schema";
@Controller("users")
@ApiTags("users")
export class UsersController {
  constructor(private userService: UsersService) {}
  @Get("/")
  @ApiPaginatedResponse(User)
  async GetAll(@Query() query): Promise<{ data: IUser[]; total: number; totalFound: number }> {
    const users = await this.userService.findAllUsers(query);
    return {
      data: users.data.map((user) => user.toJSON()),
      totalFound: users.data.length,
      total: users.total,
    };
  }
  @Get("detail/:id")
  async GetById(@Param("id") id: string): Promise<IUser> {
    if (!id) {
      throw new HttpException("no id recibed on params", 400);
    }
    if (!validateObjectId(id)) {
      throw new HttpException("invalid id", 400);
    }
    const user = await this.userService.findUserById(id);
    return user.toJSON();
  }
  @Public()
  @Post("/register")
  async Create(@Body() body: { data: IUser }): Promise<IUser> {
    if (!body.data) {
      throw new HttpException("req.data not recibed", 400);
    }
    body.data.status = "active";
    const parseResult = await UserZod.safeParseAsync(body.data);
    //TODO: Check parse results.
    if (!parseResult.success) {
      throw new HttpException("Bad Request", 400);
    }

    // const RequestUser = req.user != null ? await this.userService.findUserById((req.user as IUser).id) : null;
    // if (!RequestUser || (RequestUser.role !== UserRoles.admin && parseResult.data.role === UserRoles.admin)) {
    //   throw new HttpException("You can't create admins", 403);
    // }
    const user = await this.userService.createUser(parseResult.data);
    return user.toJSON();
  }
  @Get("/profile")
  async getProfile(@Req() req: Request) {
    const id = (req.user as any)._id as string;
    const user = await this.userService.findUserById(id);
    return user.toJSON();
  }
  @Put("/")
  async Update(@Body() body: { user: IUser }, @Req() req): Promise<{ data: IUser; status: string }> {
    if (!body.user) {
      throw new HttpException("req.user not recibed", 400);
    }
    if (!body.user.id) {
      throw new HttpException("req.user.id not recibed", 400);
    }
    const RequestUser = req.user as IUser;
    const parseResult = await UserZod.safeParseAsync(body.user);
    if (!parseResult.success) {
      throw new HttpException("Bad Request", 400);
    }
    //Role logic between users and admins
    if (RequestUser.role !== UserRoles.admin) {
      if (RequestUser.id !== parseResult.data.id) throw new HttpException("You can't edit other users", 403);
      if (parseResult.data.role !== RequestUser.role) throw new HttpException("You can't edit your role", 403);
    } else if (RequestUser.id.toString() === parseResult.data.id && parseResult.data.role !== RequestUser.role) {
      //Check if there is only one admin
      const adminCount = await this.userService.countUsers({ role: RequestUser.role });
      if (adminCount === 1) throw new HttpException("You can't edit your role, you are the only admin", 403);
    }
    const user = await this.userService.updateUserById(body.user.id, parseResult.data);

    return {
      status: "updated",
      data: user.toJSON(),
    };
  }
  @Put("/password")
  async ChangePassword(
    @Body() body: { password: string; id: string; newPassword: string },
    @Req() req: Request,
  ): Promise<{
    id: string;
    status: string;
  }> {
    if (!body.newPassword) {
      throw new HttpException("req.newPassword not recibed", 400);
    }
    const RequestUser = req.user as UserDocument;
    //  let userData: UserDocument;
    if (!body.id) {
      body.id = RequestUser.id || RequestUser._id.toString();
    }
    // else {
    //   userData = await this.userService.findUserById(body.id);
    // }
    const isSelf: boolean = (RequestUser.id || RequestUser._id.toString()) === body.id;
    if (!isSelf) {
      if (RequestUser.role !== UserRoles.admin) {
        throw new HttpException("You can't edit other users", 403);
      }
    } else {
      if (!body.password) {
        throw new HttpException("req.password not recibed", 400);
      }
    }

    await this.userService.updatePassword({
      id: body.id,
      password: body.password,
      newPassword: body.newPassword,
      isSelf,
    });
    return {
      status: "password changed",
      id: body.id,
    };
  }
  @Delete("/:id")
  async Delete(@Param("id") id: string, @Req() req): Promise<{ user: IUser; id: string; status: string }> {
    if (!id) {
      throw new HttpException("req.id not recibed", 400);
    }
    if (!validateObjectId(id)) {
      throw new HttpException("invalid id", 400);
    }
    const RequestUser = req.user as IUser;
    if (RequestUser.role !== UserRoles.admin && RequestUser.id !== id) {
      throw new HttpException("You can't edit other users", 403);
    }
    const user = await this.userService.deleteUserById(id);

    return {
      id: user.id,
      status: "deleted",
      user: user.toJSON(),
    };
  }
}
