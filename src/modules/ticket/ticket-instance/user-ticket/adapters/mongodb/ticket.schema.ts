import { model, Schema, type InferSchemaType } from "mongoose";


import { TICKET_STATUS } from "@/common/enums";
// TICKETS are created only when a user buys them
// edited when user pays, cancels or transfer them to another users/*
const TicketSchema = new Schema({
    ticketCategory: {
        type: Schema.Types.ObjectId,
        ref: 'TicketCategory'
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    status: {
        type: String,
        enum: TICKET_STATUS,
        default: TICKET_STATUS.PENDING
    },
    amount: Number,
}, { timestamps: true })

export default model('Ticket', TicketSchema)
export type TTicket = InferSchemaType<typeof TicketSchema>


