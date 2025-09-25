import type { TTicketSetup } from "@/modules/ticket/ticket-setup/setup/ports/setup.schema";
import type { TUser } from "@/modules/user/ports/user.schema";
import type { TCategory } from "@/modules/ticket/ticket-setup/category/ports/category.schema";
import { z } from "zod";
import mongoose, { Types } from "mongoose";

export type PopulatedTicketSetup = Omit<TTicketSetup, 'organizer' | 'categories'> & {
    organizer: TUser;
    categories: TCategory[];
}

 const ObjectIdSchema = z.custom<Types.ObjectId>(
    (val: any) => Types.ObjectId.isValid(val),
    {
        message: 'Invalid ObjectId',
    }
).transform((val: any) => new mongoose.Types.ObjectId(`${val}`))

export type TObjectId = z.infer<typeof ObjectIdSchema>
