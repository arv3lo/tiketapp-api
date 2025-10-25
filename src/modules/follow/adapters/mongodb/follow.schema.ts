import { model, Schema, type InferSchemaType, Types } from "mongoose";

export const followSchema = new Schema({
    follower: { type: Types.ObjectId, ref: 'User' },
    followed: { type: Types.ObjectId, ref: 'User' }, // attendees cannot be followed
}, { timestamps: true });

export type TFollow = InferSchemaType<typeof followSchema>;
export default model('Follow', followSchema);

