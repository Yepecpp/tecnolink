import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({
  timestamps: true,
  toJSON: {
    transform: (doc, ret) => {
      delete ret.__v;
      ret.id = ret._id.toString();
      delete ret._id;
      return ret;
    },
  },
})
export class Clients {
  @Prop({
    required: true,
  })
  name: string;
  @Prop({
    required: false,
  })
  cellPhone?: string;
  @Prop({
    required: true,
  })
  email: string;
  @Prop({
    required: false,
  })
  rnc?: string;
  @Prop({
    required: true,
    enum: ["individual", "company"],
  })
  type: string;
  @Prop({
    required: true,
    enum: ["active", "inactive"],
    default: "active",
  })
  status: string;
}
export const ClientSchema = SchemaFactory.createForClass(Clients);
