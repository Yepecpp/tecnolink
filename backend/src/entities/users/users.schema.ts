import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { UserRoles } from "@interfaces/users.i";

import mongoose from "mongoose";
import { ApiProperty } from "@nestjs/swagger";
@Schema({
  _id: false,
})
class Login {
  @Prop({
    required: true,
    minlength: 3,
    unique: true,
    maxlength: 25,
    type: String,
  })
  @ApiProperty()
  username: string;
  @Prop({
    required: true,
    type: Date,
  })
  @ApiProperty()
  lastPasswordChange: Date;
  @Prop({
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    type: String,
  })
  @ApiProperty()
  email: string;

  @Prop({
    required: true,
    minlength: 3,
  })
  @ApiProperty()
  password: string;

  @Prop({
    required: true,
    enum: ["local", "google"],
  })
  @ApiProperty()
  provider: string;
}
@Schema({
  _id: false,
})
class Identity {
  @Prop({
    required: true,
    enum: ["id", "passport"],
  })
  @ApiProperty()
  idType: string;

  @Prop({
    required: true,
  })
  @ApiProperty()
  idNumber: string;
}

@Schema({
  timestamps: true,
  toJSON: {
    transform: (doc, ret) => {
      if (ret.login && ret.login.password) {
        delete ret.login.password;
      }
      delete ret.__v;
      ret.id = ret._id;
      delete ret._id;
      return ret;
    },
  },
})
export class User {
  @Prop({
    required: true,
    type: Login,
  })
  @ApiProperty()
  login: Login;
  @Prop({
    type: Identity,
    required: true,
  })
  @ApiProperty()
  identity: Identity;
  @Prop({
    required: true,
    type: String,
  })
  @ApiProperty()
  name: string;
  @Prop({
    required: true,
  })
  @ApiProperty()
  lastName: string;
  @Prop({
    required: true,
  })
  @ApiProperty()
  cellPhone: string;

  @Prop({
    required: true,
    enum: ["active", "inactive", "banned"],
    default: "active",
  })
  @ApiProperty()
  status: string;
  @Prop({
    required: true,
    enum: UserRoles,
    default: UserRoles.delivery,
  })
  @ApiProperty()
  role: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
