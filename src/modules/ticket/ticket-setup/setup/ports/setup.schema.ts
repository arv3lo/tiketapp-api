import { model, Schema, type InferSchemaType } from "mongoose";
import z from "zod"

const TickerSetupSchema = new Schema({
    name: String,
    description: String,
    organizer: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    categories: {
        type: [Schema.Types.ObjectId],
        ref: 'Category',
        required: true
    }
}, {
    timestamps: true
})

export default model('TicketSetup', TickerSetupSchema);
export type TTicketSetup = InferSchemaType<typeof TickerSetupSchema>

export const ticketSetupInput = z.object({
    name: z.string().min(3).max(100),
    description: z.string().optional(),
    organizer: z.string(),
    categories: z.array(z.string())
})

export type TicketSetupInput = z.infer<typeof ticketSetupInput>
export const validateTicketSetupInput = (input: TicketSetupInput) =>
    ticketSetupInput.parse(input)