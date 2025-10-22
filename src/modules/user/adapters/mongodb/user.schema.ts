import { model, Schema, type InferSchemaType } from "mongoose";
import jwt from "jsonwebtoken"

import { USER_ROLE } from "@/common/enums";
// TODO: add roles
// TODO: decide whether separate user and artist models
// or keep it as one
const userSchema = new Schema({
    fullname: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: {
        type: String,
        enum: USER_ROLE,
        default: USER_ROLE.ATTENDEE,
        required: true
    },
    isDeleted: { type: Boolean, default: false },
}, {
    timestamps: true
});

userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({
        _id: this._id,
        role: this.role,
        iat: Math.floor(Date.now() / 1000) - 30,
        exp: Math.floor(Date.now() / 1000) + (60 * 360)
    }, Bun.env.AUTH_TOKEN_SECRET || "");

    return token;
}

// This is only for dev purpose
userSchema.pre("insertMany", async function (next, docs) {
    if (!docs || docs.length === 0) {
        return next();
    }

    for (const doc of docs) {
        if (!doc.password) {
            continue;
        }

        const hashedPwd = await Bun.password.hash(doc.password, {
            algorithm: "argon2id",
            memoryCost: 4,
            timeCost: 3,
        });

        doc.password = hashedPwd;
    }

    next();
});

userSchema.pre('save', async function (next) {
    if (!this.password) {
        return next();
    }

    const hashedPwd = await Bun.password.hash(this.password, {
        algorithm: "argon2id",
        memoryCost: 4,
        timeCost: 3,
    });

    this.password = hashedPwd;
    next();
})

export type TUser = InferSchemaType<typeof userSchema>

export default model('User', userSchema);



