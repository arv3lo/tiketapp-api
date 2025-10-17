import { Router } from "express";

import { TicketCategoryService } from "@user-ticket-category/ticket-category.service";
import { MongooseTicketCategoryRepo } from "@user-ticket-category/adapters/mongodb/ticket-category.repo";
import TicketCategory from "@user-ticket-category/adapters/mongodb/ticket-category.schema";
import { validateTicketCategoryInput } from '@user-ticket-category/ports/ticket-category.port'

const router = Router()
const ticketCategoryService = new TicketCategoryService(new MongooseTicketCategoryRepo(TicketCategory))

// get categories by eventID, setupID
router.get('/', async (req, res) => {
    const categories = await ticketCategoryService.findCategoryByEventId(req.query.eventId as string)
    if (!categories) return res.status(404).json({ message: 'Categories not found' })

    res.json(categories)
})

router.get('/:id', async (req, res) => {
    const category = await ticketCategoryService.findCategoryById(req.params.id)
    if (!category) return res.status(404).json({ message: 'Category not found' })

    res.json(category)
})

router.post('/', async (req, res) => {
    const categoryInput = validateTicketCategoryInput(req.body)
    const category = await ticketCategoryService.createCategory(categoryInput)
    if (!category) return res.status(404).json({ message: 'Category not created' })

    res.json(category)
})

router.put('/:id', async (req, res) => {
    const categoryInput = validateTicketCategoryInput(req.body)
    const category = await ticketCategoryService.updateCategory(req.params.id, categoryInput)
    if (!category) return res.status(404).json({ message: 'Category not updated' })

    res.json(category)
})

router.delete('/:id', async (req, res) => {
    const category = await ticketCategoryService.deleteCategory(req.params.id)
    if (!category) return res.status(404).json({ message: 'Category not deleted' })

    res.json(category)
})

export default router;

