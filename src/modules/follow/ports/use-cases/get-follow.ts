import { MongooseFollowRepo } from "@follow/adapters/mongodb/follow.repo"
import { FollowService } from "@follow/ports/follow.service"
import Follow, { type TFollow } from "@follow/adapters/mongodb/follow.schema"
import { ERROR_MESSAGE } from "@/common/enums"

const followService = new FollowService(new MongooseFollowRepo(Follow))

export const findFollowers = async(id: string): Promise<TFollow[]> => {
    const followers = await followService.findFollowers(id)

    if(!followers) throw new Error(ERROR_MESSAGE.NOT_FOUND)

    return followers;
}

export const findFollowed = async(id: string): Promise<TFollow[]> => {
    const followed = await followService.findFollowed(id)

    if(!followed) throw new Error(ERROR_MESSAGE.NOT_FOUND)

    return followed;
}