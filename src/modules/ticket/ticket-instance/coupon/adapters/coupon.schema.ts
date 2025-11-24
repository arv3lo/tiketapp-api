import { Schema, model, type InferSchemaType } from "mongoose"

import { DISCOUNT_TYPE } from "@/common/enums"

const couponSchema = new Schema({
    code: {
        type: String,
        required: true,
        unique: true
    },
    discountType: {
        type: String,
        enum: DISCOUNT_TYPE,
        default: DISCOUNT_TYPE.PERCENTAGE
    },
    discount: {
        type: Number,
        required: true
    },
    expirationDate: {
        type: Date,
        required: true
    },
    perUserLimit: {
        type: Number,
        required: true
    },
    maxUses: {
        type: Number,
        required: true
    }
}, { timestamps: true })

const couponUsages = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    coupon: {
        type: Schema.Types.ObjectId,
        ref: 'Coupon',
        required: true
    },
    usedAt: {
        type: Date,
        required: true
    }
})

export default model('Coupon', couponSchema)
export type TCoupon = InferSchemaType<typeof couponSchema>

export const couponUsagesModel = model('CouponUsages', couponUsages)
export type TCouponUsages = InferSchemaType<typeof couponUsages>