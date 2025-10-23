import { Router } from "express";

import { isValidID } from "@/middlewares/mongoID";

const router = Router()

router.get('/:model/:id', isValidID, (req, res) => {
    const { model, id } = req.params
    res.json({ msg: 'History' })
})

export default router