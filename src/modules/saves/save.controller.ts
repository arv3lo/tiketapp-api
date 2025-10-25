import { Router } from "express";

import { isValidID } from "@/middlewares";
import { ERROR_MESSAGE } from "@/common/enums";

const router = Router();

router.get('/:id', isValidID, async (req, res) => {
    try {

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : ERROR_MESSAGE.UNKNOWN_ERROR
        res.status(400).json({ message: errorMessage });
    }
})

router.get('user/:id', isValidID, async (req, res) => {
    try {

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : ERROR_MESSAGE.UNKNOWN_ERROR
        res.status(400).json({ message: errorMessage });
    }
})

router.post('/:id', isValidID, async (req, res) => {
    try {

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : ERROR_MESSAGE.UNKNOWN_ERROR
        res.status(400).json({ message: errorMessage });
    }
})

router.delete('/:id', isValidID, async (req, res) => {
    try {

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : ERROR_MESSAGE.UNKNOWN_ERROR
        res.status(400).json({ message: errorMessage });
    }
})

export default router;