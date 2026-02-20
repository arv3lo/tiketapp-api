import jwt from 'jsonwebtoken'

const ACCESS_TOKEN_SECRET = Bun.env.ACCESS_TOKEN_SECRET || "";
const REFRESH_TOKEN_SECRET = Bun.env.REFRESH_TOKEN_SECRET || "";

export function generateAccessToken(userId: string) {
    return jwt.sign({ userId }, ACCESS_TOKEN_SECRET, { expiresIn: "1h" })
}

export function generateRefreshToken(userId: string) {
    return jwt.sign({ userId }, REFRESH_TOKEN_SECRET, { expiresIn: "7d" })
}

export function hashToken(token: string) {
    const hasher = new Bun.CryptoHasher("sha256")
    const result = hasher.update(token).digest("hex")
    console.log('!!hasher: ', result)
    return result
}