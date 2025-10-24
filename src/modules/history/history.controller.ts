import { Router } from "express";

import { getHistory, getHistoryById } from "@history/ports/use-cases/get-history";
import { ERROR_MESSAGE } from "@/common/enums";
import { isValidID } from "@/middlewares/mongoID";

const router = Router()

router.get('/:model/:id', isValidID, (req, res) => {
    try {
        const { model, id } = req.params
        const history = getHistory({ model, obj: id, ...req.query })
        res.status(200).json(history)
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : ERROR_MESSAGE.UNKNOWN_ERROR
        res.status(400).json({ message: errorMessage })
    }
})

router.get('/:id', isValidID, (req, res) => {
    try {
        const history = getHistoryById(req.params.id)
        res.status(200).json(history)
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : ERROR_MESSAGE.UNKNOWN_ERROR
        res.status(400).json({ message: errorMessage })
    }
})

export default router