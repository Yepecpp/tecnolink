import { IUser, UserDocument } from "@/interfaces/users.i";
import { HttpException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { User } from "./users.schema";
import { Model } from "mongoose";
import { MongooseFilter, createMongooseFilter } from "@/utils/mongoose.filter";
import * as bcrypt from "bcrypt";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private config: ConfigService,
  ) {}

  async createUser(user: IUser): Promise<UserDocument> {
    if (user.id) {
      delete user.id;
    }

    const checkAv = await this.userModel.find({
      $or: [{ "login.username": user.login.username }, { "login.email": user.login.email }],
    });
    if (checkAv.length > 0) {
      let execption = "Error";
      checkAv.forEach((u) => {
        if (u.login.email === user.login.email) {
          execption += " Email is already taken.";
        }
        if (u.login.username === user.login.username) {
          execption += " Username is already taken.";
        }
      });
      if (execption !== "Error") throw new HttpException(execption, 409);
    }
    const salt = await bcrypt.genSalt(this.config.get("saltRounds"));
    user.login.password = await bcrypt.hash(user.login.password, salt);
    user.login.lastPasswordChange = new Date();
    const createdUser = new this.userModel(user);
    return createdUser.save();
  }
  async findAllUsers(query: any): Promise<{ data: UserDocument[]; total: number }> {
    const filter = await createMongooseFilter(query, this.userModel.schema.paths);
    const results = Promise.allSettled([
      this.userModel.find(filter.filter).limit(filter.limit).skip(filter.offset).sort(filter.sort).populate("branch"),
      this.userModel.countDocuments(filter.filter),
    ]);
    const [data, total] = await results;
    if (data.status === "rejected") {
      throw new HttpException(data.reason, 500);
    }
    if (total.status === "rejected") {
      throw new HttpException(total.reason, 500);
    }
    return { data: data.value, total: total.value };
  }
  async findUserById(id: string): Promise<UserDocument> {
    return this.userModel.findById(id).populate("branch");
  }
  async findUserInternal(filter): Promise<UserDocument[]> {
    return this.userModel.find(filter).populate("branch");
  }
  async findUserOne(filter: MongooseFilter<IUser>): Promise<UserDocument> {
    return this.userModel.findOne(filter.filter).populate("branch");
  }
  async findLogin(search: string): Promise<UserDocument> {
    if (!search) {
      return null;
    }
    return this.userModel
      .findOne({
        $or: [{ "login.username": search }, { "login.email": search }],
      })
      .populate("branch");
  }

  async updateUserById(id: string, user: IUser): Promise<UserDocument> {
    const dbUser = await this.userModel.findById(id);
    if (!dbUser) {
      throw new HttpException("User not found", 404);
    }

    const checkAv = await this.userModel.find({
      $or: [{ "login.username": user.login.username }, { "login.email": user.login.email }],
    });
    if (checkAv.length > 0) {
      let execption = "Error";
      checkAv.forEach((u) => {
        if (u.id === user.id) {
          return;
        }
        if (u.login.email === user.login.email) {
          execption += " Email is already taken.";
        }
        if (u.login.username === user.login.username) {
          execption += " Username is already taken.";
        }
      });
      if (execption !== "Error") throw new HttpException(execption, 409);
    }
    user.login.password = dbUser.login.password;
    dbUser.set(user);
    await dbUser.save();
    return dbUser;
  }
  async deleteUserById(id: string): Promise<UserDocument> {
    return this.userModel.findByIdAndDelete(id);
  }
  async updatePassword(credentials: {
    id: string;
    password: string | undefined;
    newPassword: string;
    isSelf: boolean;
  }): Promise<UserDocument> {
    const dbUser = await this.userModel.findById(credentials.id);
    if (!dbUser) {
      throw new HttpException("User not found", 404);
    }
    if (
      credentials.isSelf &&
      credentials.password &&
      !(await bcrypt.compare(credentials.password, dbUser.login.password))
    ) {
      throw new HttpException("Wrong old password", 400);
    }
    const salt = await bcrypt.genSalt(this.config.get("saltRounds"));
    const hash = await bcrypt.hash(credentials.newPassword, salt);
    dbUser.login.password = hash; // Update the password field directly
    dbUser.login.lastPasswordChange = new Date(); // Update the lastPasswordChange field

    await dbUser.save();
    return dbUser;
  }
  async countUsers(filter): Promise<number> {
    return this.userModel.countDocuments(filter || {});
  }
}
