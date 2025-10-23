import { model, Schema, type InferSchemaType } from "mongoose";

import { HISTORY_OBJECT, HISTORY_TYPE } from "@/common/enums";

const historySchema = new Schema({
    description: { type: String, required: true },
    type: { type: String, enum: HISTORY_TYPE, required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    obj: {
        type: Schema.Types.ObjectId,
        refPath: 'model'
    },
    model: {
        type: String,
        enum: HISTORY_OBJECT,
        default: HISTORY_OBJECT.USER
    }
}, { timestamps: true })

export type THistory = InferSchemaType<typeof historySchema>
export default model('History', historySchema)