import { model, Schema, type InferSchemaType } from "mongoose";

// here we chose to let available amount as it is even when the event is over
// so that we can track the number of tickets unsold
// and use isAvailable as an indicator of the ticket category availability
// because, sometimes, an event can be more than one day long
// and tickets for the other days can be sold during the event
const TicketCategorySchema = new Schema({
    name: String,
    description: String,
    event: {
        type: Schema.Types.ObjectId,
        ref: 'Event'
    },
    price: Number,

    availableAmount: { type: Number, default: 0 },
    // TODO: make sure to set this to false 
    // if a release date is set to a future date or if the event is ended
    // maybe use a trigger or a cron job to set this to false when the release date is due
    isAvailable: { type: Boolean, default: true },
    // when release date is due, tickets are available for purchase
    // TODO: send notification to users that subscribed to the event, the organizer and the artists
    releaseDate: { type: Date, default: undefined },
    refund: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false }
}, { timestamps: true })

export default model('TicketCategory', TicketCategorySchema)
export type TTicketCategory = InferSchemaType<typeof TicketCategorySchema>





