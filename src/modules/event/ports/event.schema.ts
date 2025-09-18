import { EventStatus, EventType } from "@/common/enums";
import { model, Schema, type InferSchemaType } from "mongoose";
import z from "zod"

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
        enum: EventType,
        default: EventType.CONCERT
    },
    status: {
        type: String,
        enum: EventStatus,
        default: EventStatus.DRAFT
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
    organizers: z.array(z.string()).min(1),
    status: z.enum(['draft', 'published', 'cancelled']).default('draft'),
    type: z.enum(EventType).default(EventType.CONCERT),
});

export type TEventInput = z.infer<typeof eventInput>
