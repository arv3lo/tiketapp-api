import type { AuthRepository, RefreshTokenInput } from "@auth/ports/auth.port";
import type { TRefreshToken } from "@auth/adapters/mongodb/token-schema";

export class AuthService {
    constructor(private readonly authRepository: AuthRepository) { }

    async loginUser(payload: RefreshTokenInput): Promise<TRefreshToken> {
        return this.authRepository.loginUser(payload);
    }

    async logoutUser(payload: RefreshTokenInput): Promise<boolean> {
        return this.authRepository.logoutUser(payload);
    }
}