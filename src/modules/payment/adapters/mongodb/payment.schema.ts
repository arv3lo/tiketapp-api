import { model, Schema, type InferSchemaType } from "mongoose"

import { PAYMENT_STATUS } from "@/common/enums"

const transactionSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    amount: Number,
    status: {
        type: String,
        enum: PAYMENT_STATUS,
        default: PAYMENT_STATUS.PENDING
    }
}, { timestamps: true })

export default model('Transaction', transactionSchema)
export type TTransaction = InferSchemaType<typeof transactionSchema>