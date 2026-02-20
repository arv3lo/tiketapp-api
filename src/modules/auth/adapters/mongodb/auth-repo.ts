// import type { EventRepository, IEventFilter, TEventInput } from "@event/ports/event.port";
import { hashToken } from "@/config/tokens";
import RefreshToken, {type TRefreshToken} from "@auth/adapters/mongodb/token-schema";
import type { AuthRepository, RefreshTokenInput } from "@auth/ports/auth.port";


export class MongooseAuthRepo implements AuthRepository {
    constructor(private readonly refreshToken: typeof RefreshToken) { }


    loginUser(payload: RefreshTokenInput): Promise<TRefreshToken> {
        return this.refreshToken.create({
            user: payload.userId,
            tokenHash: hashToken(payload.refreshToken),
            expiresAt: new Date(Date.now() + (7 * 24 * 60 * 60 * 1000)),
            deviceId: payload.deviceId,
        })

    }
    async logoutUser(payload: RefreshTokenInput): Promise<boolean> {
        const deleted = await this.refreshToken.deleteOne({
            user: payload.userId,
            deviceId: payload.deviceId,
            tokenHash: hashToken(payload.refreshToken)
        })

        if(!deleted) return false;
        return true
    }
}