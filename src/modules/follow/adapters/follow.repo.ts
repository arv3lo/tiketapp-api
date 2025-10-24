import type { IFollowRepository } from "@follow/ports/follow.port";
import Follow from "@follow/adapters/follow.schema";
import type { TFollow } from "@follow/adapters/follow.schema";

export class MongooseFollowRepo implements IFollowRepository {
    constructor(private readonly followModel: typeof Follow) { }

    async findFollowers(id: string): Promise<TFollow[]> {
        return this.followModel.find({ follower: id }).lean()
    }

    async findFollowerCount(id: string): Promise<number> {
        return this.followModel.countDocuments({ follower: id })
    }

    async findFollowed(id: string): Promise<TFollow[]> {
        return this.followModel.find({ followed: id }).lean()
    }

    async findFollowedCount(id: string): Promise<number> {
        return this.followModel.countDocuments({ followed: id })
    }

    async follow(id: string, followedId: string): Promise<TFollow> {
        return this.followModel.create({ follower: id, followed: followedId })
    }

    async unfollow(id: string, followedId: string): Promise<TFollow | null> {
        return this.followModel.findOneAndDelete({ follower: id, followed: followedId })
    }
}