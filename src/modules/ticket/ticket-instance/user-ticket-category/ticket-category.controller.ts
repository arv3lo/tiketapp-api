import { Router } from "express";

import { TicketCategoryService } from "@user-ticket-category/ticket-category.service";
import { MongooseTicketCategoryRepo } from "@user-ticket-category/adapters/mongodb/ticket-category.repo";
import TicketCategory from "@user-ticket-category/adapters/mongodb/ticket-category.schema";
import { validateTicketCategoryInput } from '@user-ticket-category/ports/ticket-category.port'
import { ERROR_MESSAGE } from "@/common/enums";

const router = Router()
const ticketCategoryService = new TicketCategoryService(new MongooseTicketCategoryRepo(TicketCategory))

// get categories by eventID, setupID
router.get('/', async (req, res) => {
    const categories = await ticketCategoryService.findCategoryByEventId(req.query.eventId as string)
    if (!categories) return res.status(404).json({ message: ERROR_MESSAGE.NOT_FOUND })

    res.status(200).json(categories)
})

router.get('/:id', async (req, res) => {
    const category = await ticketCategoryService.findCategoryById(req.params.id)
    if (!category) return res.status(404).json({ message: ERROR_MESSAGE.NOT_FOUND })

    res.status(200).json(category)
})

router.post('/', async (req, res) => {
    try {
        const categoryInput = validateTicketCategoryInput(req.body)
        const category = await ticketCategoryService.createCategory(categoryInput)
        if (!category) return res.status(404).json({ message: ERROR_MESSAGE.NOT_CREATED })
    
        res.status(200).json(category)
    } catch (error) {
        res.status(400).json({ message: ERROR_MESSAGE.INVALID_INPUT })
    }
})

router.put('/:id', async (req, res) => {
    try {
        const categoryInput = validateTicketCategoryInput(req.body)
        const category = await ticketCategoryService.updateCategory(req.params.id, categoryInput)
        if (!category) return res.status(404).json({ message: ERROR_MESSAGE.NOT_UPDATED })
    
        res.status(200).json(category)
    } catch (error) {
        res.status(400).json({ message: ERROR_MESSAGE.INVALID_INPUT })
    }
})

router.delete('/:id', async (req, res) => {
    const category = await ticketCategoryService.deleteCategory(req.params.id)
    if (!category) return res.status(404).json({ message: ERROR_MESSAGE.NOT_DELETED })

    res.status(200).json(category)
})

export default router;

