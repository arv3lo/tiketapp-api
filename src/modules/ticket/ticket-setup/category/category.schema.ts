import { model, Schema, type InferSchemaType } from "mongoose";
import z from "zod";

const categorySchema = new Schema({
    name: String,
    description: String,
}, { timestamps: true })

export default model('Category', categorySchema)
export type Category = InferSchemaType<typeof categorySchema>

export const categoryInput = z.object({
    name: z.string().min(3).max(100),
    description: z.string(),
})

export type CategoryInput = z.infer<typeof categoryInput>
export const validateCategoryInput = (input: CategoryInput) => categoryInput.parse(input)