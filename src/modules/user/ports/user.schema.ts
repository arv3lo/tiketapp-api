import { model, Schema, type InferSchemaType } from "mongoose";
import z from "zod"

const userSchema = new Schema({
    fullname: String,
    email: String,
    password: String,
    isDeleted: Boolean,
}, {
    timestamps: true
});

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
    password: z.string().min(6).max(100),
    isDeleted: z.boolean().default(false).optional(),
});

export type TUserInput = z.infer<typeof userInput>

export const validateUser = (user: TUserInput) => userInput.parse(user);

