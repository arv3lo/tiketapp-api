import type { IFollowRepository } from "@follow/ports/follow.port";
import Follow, { type TFollow } from "@follow/adapters/mongodb/follow.schema";
import type { TFollowInput } from "@follow/ports/follow.port";

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

    async follow(payload: TFollowInput): Promise<TFollow> {
        const { user, followed } = payload
        return this.followModel.create({ follower: user, followed })
    }

    async unfollow(payload: TFollowInput): Promise<TFollow | null> {
        const { user, followed } = payload
        return this.followModel.findOneAndDelete({ follower: user, followed })
    }
}