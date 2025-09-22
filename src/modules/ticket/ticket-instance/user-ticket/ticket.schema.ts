import { model, Schema, type InferSchemaType } from "mongoose";
import z from "zod";

import { TICKET_STATUS } from "@/common/enums";

const TicketSchema = new Schema({
    name: String,
    description: String,
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
    }
}, { timestamps: true })

export default model('Ticket', TicketSchema)
export type Ticket = InferSchemaType<typeof TicketSchema>

export const ticketInput = z.object({
    name: z.string().min(3).max(100),
    description: z.string(),
    ticketCategory: z.string(),
    user: z.string(),
    status: z.enum(TICKET_STATUS),
})

export type TicketInput = z.infer<typeof ticketInput>
export const validateTicketInput = (input: TicketInput) => ticketInput.parse(input)
