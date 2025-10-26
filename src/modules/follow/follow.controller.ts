import { Router } from "express";

import { findFollowers, findFollowed } from "@follow/ports/use-cases/get-follow";
import { ERROR_MESSAGE } from "@/common/enums";
import { follow, unfollow } from "./ports/use-cases/post-follow";
import { isValidID } from "@/middlewares";

const router = Router();

router.get('/followers/:id', isValidID, async (req, res) => {
    try {
        const followers = await findFollowers(req.params.id)

        res.status(200).json(followers)
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : ERROR_MESSAGE.UNKNOWN_ERROR
        res.status(400).json({ message: errorMessage });
    }
})

router.get('/followed/:id', isValidID, async (req, res) => {
    try {
        const followed = await findFollowed(req.params.id)

        res.status(200).json(followed)
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : ERROR_MESSAGE.UNKNOWN_ERROR
        res.status(400).json({ message: errorMessage });
    }
})

// follow someone
router.post('/:id', isValidID, async (req, res) => {
    try {
        const newFollow = await follow(req.user?.id || "", req.params.id)

        res.status(200).json(newFollow)
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : ERROR_MESSAGE.UNKNOWN_ERROR
        res.status(400).json({ message: errorMessage });
    }
})

// unfollow someone
router.delete('/:id', isValidID, async (req, res) => {
    try {
        const oldFollow = await unfollow(req.user?.id || "", req.params.id)

        res.status(200).json(oldFollow)
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : ERROR_MESSAGE.UNKNOWN_ERROR
        res.status(400).json({ message: errorMessage });
    }
})


export default router;
