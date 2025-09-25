import { model, Schema, type InferSchemaType } from "mongoose";
import z from "zod";

import { TICKET_STATUS } from "@/common/enums";

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

export const ticketInput = z.object({
    ticketCategory: z.string(),
    user: z.string(),
    status: z.enum(TICKET_STATUS),
    amount: z.number().min(1),
})

export type TicketInput = z.infer<typeof ticketInput>
export const validateTicketInput = (input: TicketInput) => ticketInput.parse(input)
