import { z } from "zod";
import mongoose from "mongoose";
export const zodObjectId = z.string().refine((value) => mongoose.Types.ObjectId.isValid(value), {
  message: "Invalid ObjectId",
});
