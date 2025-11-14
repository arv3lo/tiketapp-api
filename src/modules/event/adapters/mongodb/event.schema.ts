import { model, Schema, type InferSchemaType } from "mongoose";

import { EVENT_STATUS, EVENT_TYPE } from "@/common/enums";
import type { TObjectId } from "@/common/types";
// FILTERS: name, description, organizers, status, date, location, artists

const eventSchema = new Schema({
    name: String,
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: false },
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
    // set this as a string for now
    // in the future, we can use geolocation coordinates
    location: {type: String, required: true},
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
    image: String,
    // ticketSetup: Number
}, {
    timestamps: true
});

export default model('Event', eventSchema);
export type TEvent = InferSchemaType<typeof eventSchema> & { _id: TObjectId }

