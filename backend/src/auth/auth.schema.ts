import { Prop } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";

export class LoginDTO {
  @Prop({ required: true, type: String })
  @ApiProperty()
  username: string;

  @Prop({ required: true, type: String })
  @ApiProperty()
  password: string;
}
