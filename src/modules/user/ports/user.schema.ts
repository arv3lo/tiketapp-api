import { model, Schema, type InferSchemaType } from "mongoose";
import z from "zod"
import jwt from "jsonwebtoken"

import { USER_ROLE } from "@/common/enums";

// TODO: add roles
// TODO: decide whether separate user and artist models
// or keep it as one
const userSchema = new Schema({
    fullname: String,
    email: String,
    password: String,
    role: {
        type: String,
        enum: USER_ROLE,
        default: USER_ROLE.ATTENDEE
    },
    isDeleted: Boolean,
}, {
    timestamps: true
});

userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({
        _id: this._id,
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

export const userInput = z.object({
    fullname: z.string().min(3).max(100),
    email: z.email(),
    role: z.enum(USER_ROLE),
    password: z.string().min(6).max(100),
    isDeleted: z.boolean().default(false).optional(),
});

export type TUserInput = z.infer<typeof userInput>

export const validateUser = (user: TUserInput) => userInput.parse(user);

