import type { TFollow } from "@follow/adapters/follow.schema";

export interface IFollowRepository {
    findFollowers(id: string): Promise<TFollow[]>;
    findFollowerCount(id: string): Promise<number>;
    findFollowed(id: string): Promise<TFollow[]>;  
    findFollowedCount(id: string): Promise<number>;
    follow(id: string, followedId: string): Promise<TFollow>;
    unfollow(id: string, followedId: string): Promise<TFollow | null>;
}
