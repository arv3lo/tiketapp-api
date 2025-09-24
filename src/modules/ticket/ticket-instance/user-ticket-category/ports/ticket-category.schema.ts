import { model, Schema, type InferSchemaType } from "mongoose";
import z from "zod";

const TicketCategorySchema = new Schema({
    name: String,
    description: String,
    event: {
        type: Schema.Types.ObjectId,
        ref: 'Event'
    },
    price: Number,
    amountAvailable: Number,
}, { timestamps: true })

export default model('TicketCategory', TicketCategorySchema)
export type TTicketCategory = InferSchemaType<typeof TicketCategorySchema>

export const ticketCategoryInput = z.object({
    name: z.string().min(3).max(100),
    description: z.string(),
    event: z.string(),
    price: z.number().optional(),
    amountAvailable: z.number().optional(),
})

export type TicketCategoryInput = z.infer<typeof ticketCategoryInput>
export const validateTicketCategoryInput = (input: TicketCategoryInput) => ticketCategoryInput.parse(input)



