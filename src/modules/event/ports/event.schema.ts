import { model, Schema, type InferSchemaType } from "mongoose";
import z from "zod"

import { EVENT_STATUS, EVENT_TYPE } from "@/common/enums";
// FILTERS: name, description, organizers, status, date, location, artists

const eventSchema = new Schema({
    name: String,
    date: Date,
    // time: String,
    description: String,
    organizers: {
        // TODO: add a checker to ensure that the organizers are valid users
        type: [Schema.Types.ObjectId],
        ref: "User",
        required: true
    },
    artists: {
        type: [Schema.Types.ObjectId],
        ref: "User",
        required: true
    },
    sponsors: {
        type: [Schema.Types.ObjectId],
        ref: "User",
        required: true
    },
    // location: {
    //     type: {
    //         type: String, 
    //         enum: ['Point'],
    //         required: true
    //     },
    //     coordinates: {
    //         type: [Number],
    //         required: true
    //     }
    // },
    type: {
        type: String,
        enum: EVENT_TYPE,
        default: EVENT_TYPE.CONCERT
    },
    status: {
        type: String,
        enum: EVENT_STATUS,
        default: EVENT_STATUS.DRAFT
    },
}, {
    timestamps: true
});

export default model('Event', eventSchema);
export type TEvent = InferSchemaType<typeof eventSchema>

export const eventInput = z.object({
    name: z.string().min(3).max(100),
    // location: z.string().min(3).max(100),
    date: z.date(),
    // time: z.string().min(3).max(100),
    description: z.string().min(3).max(100),
    status: z.enum(EVENT_STATUS).default(EVENT_STATUS.DRAFT),
    type: z.enum(EVENT_TYPE).default(EVENT_TYPE.CONCERT),
    organizers: z.array(z.string()).min(1),
    artists: z.array(z.string()),
    sponsors: z.array(z.string()),
});

export type TEventInput = z.infer<typeof eventInput>
export const validateEvent = (event: TEventInput) => eventInput.parse(event)