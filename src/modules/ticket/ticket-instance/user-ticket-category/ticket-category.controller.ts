import { Router } from "express";

import { validateTicketCategoryInput } from '@user-ticket-category/ports/ticket-category.port'
import { getTicketCategories, getTicketCategory } from "@user-ticket-category/ports/use-cases/get-ticket-categories";
import { createTicketCategory } from "@user-ticket-category/ports/use-cases/create-ticket-category";
import { deleteTicketCategory, updateTicketCategory } from "@user-ticket-category/ports/use-cases/update-ticket-category";
import { ERROR_MESSAGE } from "@/common/enums";

const router = Router()

// get categories by eventID, setupID
router.get('/', async (req, res) => {
    try {
        const categories = await getTicketCategories(req.query.eventId as string)

        res.status(200).json(categories)
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : ERROR_MESSAGE.UNKNOWN_ERROR
        res.status(400).json({ message: errorMessage })
    }
})

router.get('/:id', async (req, res) => {
    try {
        const category = await getTicketCategory(req.params.id)

        res.status(200).json(category)
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : ERROR_MESSAGE.UNKNOWN_ERROR
        res.status(400).json({ message: errorMessage })
    }
})

router.post('/', async (req, res) => {
    try {
        const categoryInput = validateTicketCategoryInput(req.body)
        const category = await createTicketCategory(categoryInput)

        res.status(200).json(category)
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : ERROR_MESSAGE.UNKNOWN_ERROR
        res.status(400).json({ message: errorMessage })
    }
})

router.put('/:id', async (req, res) => {
    try {
        const categoryInput = validateTicketCategoryInput(req.body)
        const category = await updateTicketCategory(req.params.id, categoryInput)

        res.status(200).json(category)
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : ERROR_MESSAGE.UNKNOWN_ERROR
        res.status(400).json({ message: errorMessage })
    }
})

router.delete('/:id', async (req, res) => {
    try {
        const category = await deleteTicketCategory(req.params.id)

        res.status(200).json(category)
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : ERROR_MESSAGE.UNKNOWN_ERROR
        res.status(400).json({ message: errorMessage })
    }
})

export default router;

