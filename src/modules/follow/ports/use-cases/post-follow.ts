import { MongooseFollowRepo } from "@follow/adapters/follow.repo"
import { FollowService } from "@follow/ports/follow.service"
import Follow, { type TFollow } from "@follow/adapters/follow.schema"
import { ERROR_MESSAGE } from "@/common/enums"

const followService = new FollowService(new MongooseFollowRepo(Follow))

export const follow = async (id: string, followed: string): Promise<TFollow> => {
    const follow = await followService.follow(id, followed)

    if(!follow) throw new Error(ERROR_MESSAGE.NOT_FOUND)

    return follow;
}

export const unfollow = async (id: string, followed: string): Promise<TFollow | null> => {
    const unfollow = await followService.unfollow(id, followed)

    if(!unfollow) throw new Error(ERROR_MESSAGE.NOT_FOUND)

    return unfollow;
}