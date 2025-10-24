import type { TTicketSetup } from "@setup/adapters/mongodb/setup.schema";
import type { TUser } from "@user/adapters/mongodb/user.schema";
import type { TCategory } from "@category/adapters/mongodb/category.schema";
import { z } from "zod";
import mongoose, { Types } from "mongoose";
import type { HISTORY_OBJECT } from "./enums";

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

export type MongoChangeStreamPipeline = Array<{
    $match?: {
        operationType?: string;
        'fullDocument.email'?: string;
        [key: string]: any;
    };
    [key: string]: any;
}>;

export type THistoryData = {
    type: string;
    description: string;
    user?: TObjectId;
    obj: TObjectId;
    model: HISTORY_OBJECT;
}
