import { UsersService } from "@/entities/users/users.service";
import { Injectable } from "@nestjs/common";

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}
  LogIn = async (string: string) => this.usersService.findLogin(string);
  findUser = async (id: string) => this.usersService.findUserById(id);
}
