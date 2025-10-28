import { Router } from "express";

import { isValidID } from "@/middlewares";
import { ERROR_MESSAGE } from "@/common/enums";
import { findSaveById, findSavesByUserId } from "@saves/ports/use-case/get-saves";
import { createSave, deleteSave } from "@saves/ports/use-case/post-saves";

const router = Router();

// find one save by it's id
router.get('/:id', isValidID, async (req, res) => {
    try {
        const save = await findSaveById(req.params.id)
        
        res.status(200).json(save)
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : ERROR_MESSAGE.UNKNOWN_ERROR
        res.status(400).json({ message: errorMessage });
    }
})

// find all saves by user id
// TODO: maybe add a pagination or limit
router.get('user/:id', isValidID, async (req, res) => {
    try {
        const saves = await findSavesByUserId(req.params.id)

        res.status(200).json(saves)
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : ERROR_MESSAGE.UNKNOWN_ERROR
        res.status(400).json({ message: errorMessage });
    }
})

router.post('/:id', isValidID, async (req, res) => {
    try {
        const save = await createSave(req.body)

        res.status(200).json(save)
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : ERROR_MESSAGE.UNKNOWN_ERROR
        res.status(400).json({ message: errorMessage });
    }
})

router.delete('/:id', isValidID, async (req, res) => {
    try {
        const save = await deleteSave(req.params.id)

        res.status(200).json(save)
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : ERROR_MESSAGE.UNKNOWN_ERROR
        res.status(400).json({ message: errorMessage });
    }
})

export default router;