import { model, Schema, type InferSchemaType } from "mongoose";
import z from "zod";

const TicketCategorySchema = new Schema({
    name: String,
    description: String,
    setup: {
        type: Schema.Types.ObjectId,
        ref: 'Setup'
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category'
    },
    event: {
        type: Schema.Types.ObjectId,
        ref: 'Event'
    },
    price: Number,
}, { timestamps: true })

export default model('TicketCategory', TicketCategorySchema)
export type TicketCategory = InferSchemaType<typeof TicketCategorySchema>

export const ticketCategoryInput = z.object({
    name: z.string().min(3).max(100),
    description: z.string(),
    setup: z.string(),
    category: z.string(),
    event: z.string(),
    price: z.number(),
})

export type TicketCategoryInput = z.infer<typeof ticketCategoryInput>
export const validateTicketCategoryInput = (input: TicketCategoryInput) => ticketCategoryInput.parse(input)



