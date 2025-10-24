import type { TFollow } from "@follow/adapters/follow.schema";
import type { IFollowRepository } from "@follow/ports/follow.port";

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

    async follow(id: string, followedId: string): Promise<TFollow> {
        return this.followRepository.follow(id, followedId);
    }

    async unfollow(id: string, followedId: string): Promise<TFollow | null> {
        return this.followRepository.unfollow(id, followedId);
    }
}