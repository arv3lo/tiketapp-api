import { describe, it, expect, mock } from "bun:test";
import { FollowService } from "../src/modules/follow/ports/follow.service";
import type { IFollowRepository, TFollowInput } from "../src/modules/follow/ports/follow.port";
import type { TFollow } from "../src/modules/follow/adapters/mongodb/follow.schema";

describe("FollowService", () => {
    const followRepositoryMock: IFollowRepository = {
        findFollowers: mock((id: string) => Promise.resolve([])),
        findFollowerCount: mock((id: string) => Promise.resolve(0)),
        findFollowed: mock((id: string) => Promise.resolve([])),
        findFollowedCount: mock((id: string) => Promise.resolve(0)),
        follow: mock((payload: TFollowInput) => Promise.resolve({} as TFollow)),
        unfollow: mock((payload: TFollowInput) => Promise.resolve({} as TFollow)),
    };

    const followService = new FollowService(followRepositoryMock);

    it("should find followers", async () => {
        await followService.findFollowers("1");
        expect(followRepositoryMock.findFollowers).toHaveBeenCalledWith("1");
    });

    it("should find follower count", async () => {
        await followService.findFollowerCount("1");
        expect(followRepositoryMock.findFollowerCount).toHaveBeenCalledWith("1");
    });

    it("should find followed", async () => {
        await followService.findFollowed("1");
        expect(followRepositoryMock.findFollowed).toHaveBeenCalledWith("1");
    });

    it("should find followed count", async () => {
        await followService.findFollowedCount("1");
        expect(followRepositoryMock.findFollowedCount).toHaveBeenCalledWith("1");
    });

    it("should follow a user", async () => {
        const payload: TFollowInput = { user: "1", followed: "2" };
        await followService.follow(payload);
        expect(followRepositoryMock.follow).toHaveBeenCalledWith(payload);
    });

    it("should unfollow a user", async () => {
        const payload: TFollowInput = { user: "1", followed: "2" };
        await followService.unfollow(payload);
        expect(followRepositoryMock.unfollow).toHaveBeenCalledWith(payload);
    });
});
