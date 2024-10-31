import { z } from "zod";
export const zodDateCoerce = z.union([z.number(), z.string(), z.date()]).pipe(z.coerce.date());
