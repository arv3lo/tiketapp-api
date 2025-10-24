import { model, Schema, type InferSchemaType } from "mongoose";

const TickerSetupSchema = new Schema({
    name: String,
    description: String,
    organizer: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    categories: {
        type: [Schema.Types.ObjectId],
        ref: 'Category',
        required: true
    }
}, {
    timestamps: true
})

export default model('TicketSetup', TickerSetupSchema);
export type TTicketSetup = InferSchemaType<typeof TickerSetupSchema>