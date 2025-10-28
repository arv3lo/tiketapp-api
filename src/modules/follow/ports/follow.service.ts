import type { TFollow } from "@follow/adapters/mongodb/follow.schema";
import type { IFollowRepository, TFollowInput } from "@follow/ports/follow.port";

export class FollowService {
    constructor(private readonly followRepository: IFollowRepository) { }

    async findFollowers(id: string): Promise<TFollow[]> {
        return this.followRepository.findFollowers(id);
    }

    async findFollowerCount(id: string): Promise<number> {
        return this.followRepository.findFollowerCount(id);
    }

    async findFollowed(id: string): Promise<TFollow[]> {
        return this.followRepository.findFollowed(id);
    }

    async findFollowedCount(id: string): Promise<number> {
        return this.followRepository.findFollowedCount(id);
    }

    async follow(payload: TFollowInput): Promise<TFollow> {
        const { user, followed } = payload
        return this.followRepository.follow({ user, followed });
    }

    async unfollow(payload: TFollowInput): Promise<TFollow | null> {
        const { user, followed } = payload
        return this.followRepository.unfollow({ user, followed });
    }
}