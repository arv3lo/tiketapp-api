import { Schema, model, type InferSchemaType } from "mongoose"

import type { TObjectId } from "@/common/types"

const refreshTokenSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    tokenHash: { type: String, required: true },
    expiresAt: { type: Date, required: true },

    deviceId: { type: String, required: true },
    userAgent: String,
    id: String,
})

refreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })

export default model("RefreshToken", refreshTokenSchema)
export type TRefreshToken = InferSchemaType<typeof refreshTokenSchema> & { _id: TObjectId }