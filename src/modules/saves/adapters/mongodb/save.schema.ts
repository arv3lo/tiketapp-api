import { model, Schema, Types, type InferSchemaType } from "mongoose";

const saveSchema = new Schema({
    user: { type: Types.ObjectId, ref: "User", required: true },
    event: { type: Types.ObjectId, ref: "Event", required: true },
}, { timestamps: true })

const Save = model('Save', saveSchema)
type TSave = InferSchemaType<typeof saveSchema>

export { type TSave, Save as default }

