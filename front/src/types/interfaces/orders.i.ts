import { z } from "zod";
import { zodDateCoerce } from "./common/parse.ci";
import { TicketStatus, TicketZod } from "./tickets.i";
import { UserZod } from "./users.i";

export const OrderZod = z.object({
  id: z.string().optional(),
  name: z.string().min(3, "Must be at least 3 characters long"),
  tickets: z
    .array(TicketZod)
    .or(z.array(z.string()).min(1, "Must have at least one ticket")),
  status: z.nativeEnum(TicketStatus).default(TicketStatus.created),
  //JY: obligatory ids for the creation of the order
  envoy: UserZod.or(z.string()), //ref User that is the envoy/delivery
  createdBy: UserZod.or(z.string()), //ref User that created the order
  processedBy: UserZod.or(z.string()).optional(), //ref User that processed the order
  createdAt: zodDateCoerce.optional(),
  updatedAt: zodDateCoerce.optional(),
});

export type IOrder = z.infer<typeof OrderZod>;
