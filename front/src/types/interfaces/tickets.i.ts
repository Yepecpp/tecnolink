import { z } from "zod";
import { zodDateCoerce } from "./common/parse.ci";
import { AddressZod } from "./common/address.ci";
import { ClientZod } from "@/types/interfaces/clients.i";
import { BranchesZod } from "@/types/interfaces/branches.t";
import { UserZod } from "@/types/interfaces/users.i";

export enum TicketStatus {
  created = "created",
  canceled = "canceled",
  onroute = "onroute",
  delivered = "delivered",
  complete = "complete",
  selected = "selected",
}
export enum TicketTypes {
  delivery = "delivery",
  pickup = "pickup",
  payment = "payment",
  asignation = "asignation",
  other = "other",
}
export const TicketZod = z.object({
  id: z.string().optional(),
  //JY: obligatory ids for the creation of the ticket
  branch: BranchesZod.or(z.string()), //JY: branch can be sent if the ticket is created by an admin, but if not sent, it will use the branch of the user that created the ticket.
  createdBy: UserZod.or(z.string()),
  type: z.nativeEnum(TicketTypes).default(TicketTypes.delivery),
  // JY: optional ids for the ticket
  client: ClientZod.or(z.string()).optional(), //JY: customer is optional because the customer can be created on the fly or not created at all.
  statusMap: z
    .array(
      //JY: keep track of the status changes, and the date of the change. Must BE SORTED BY DATE ASC.
      z.object({
        status: z.nativeEnum(TicketStatus),
        date: zodDateCoerce.optional(),
        comment: z.string().optional(),
      }),
    )
    .optional(),
  comments: z.string().optional(),
  address: AddressZod.optional(), //JY: the address is optional, it will take the customer address if not sent,  and  if not customer, exception will be thrown.
  //data related to the ticket invoice and ammounts
  billing: z
    .object({
      invoiceId: z.string().optional(),
      amount: z.number().default(0),
      currency: z.string().default("DOP"),
      paymentMethod: z.enum(["cash", "card", "transfer", "check"]).optional(),
      paymentStatus: z.enum(["pending", "paid"]).default("pending"),
    })
    .optional(),
  //dates for the ticket, auto generated
  maxTime: zodDateCoerce.optional(),
  createdAt: zodDateCoerce.optional(),
  updatedAt: zodDateCoerce.optional(),
});

export type ITicket = z.infer<typeof TicketZod>;
