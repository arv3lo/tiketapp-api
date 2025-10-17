import { model, Schema, type InferSchemaType } from "mongoose";

const categorySchema = new Schema({
    name: String,
    description: String,
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    }
}, { timestamps: true })

export default model('Category', categorySchema)
export type TCategory = InferSchemaType<typeof categorySchema>

