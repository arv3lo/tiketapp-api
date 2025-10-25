import type { TFollow } from "@follow/adapters/mongodb/follow.schema";
import z from "zod";

export interface IFollowRepository {
    findFollowers(id: string): Promise<TFollow[]>;
    findFollowerCount(id: string): Promise<number>;
    findFollowed(id: string): Promise<TFollow[]>;  
    findFollowedCount(id: string): Promise<number>;
    follow(savePayload: TFollowInput): Promise<TFollow>;
    unfollow(savePayload: TFollowInput): Promise<TFollow | null>;
}

export const followInput = z.object({
    user: z.string(),
    followed: z.string()
})

export type TFollowInput = z.infer<typeof followInput>
