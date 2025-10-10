import { Router } from "express";

import { TicketService } from "@user-ticket/ticket.service";
import { MongooseTicketRepo } from "@user-ticket/adapters/mongodb/ticket.repo";
import Ticket, { validateTicketInput } from "@user-ticket/adapters/mongodb/ticket.schema";

import { TicketCategoryService } from "@user-ticket-category/ticket-category.service";
import { MongooseTicketCategoryRepo } from "@user-ticket-category/adapters/mongodb/ticket-category.repo";
import TicketCategory from "@user-ticket-category/adapters/mongodb/ticket-category.schema";

const router = Router()
const ticketService = new TicketService(new MongooseTicketRepo(Ticket))
const ticketCategoryService = new TicketCategoryService(new MongooseTicketCategoryRepo(TicketCategory))

// get tickets by categoryID, userID, status, dates, etc.
router.get('/', async (req, res) => {
    const tickets = await ticketService.findTickets(req.query)
    if (!tickets) return res.status(404).json({ message: 'Tickets not found' })

    res.json(tickets)
})

router.get('/:id', async (req, res) => {
    const ticket = await ticketService.findTicketById(req.params.id)
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' })

    res.json(ticket)
})

router.post('/', async (req, res) => {
    // first, check ticket availability via ticket-category.service
    // if available, create ticket
    // if not available, return error
    const ticketInput = validateTicketInput(req.body)
    const currentTicketCategory = await ticketCategoryService.findCategoryById(ticketInput.ticketCategory)

    if (currentTicketCategory && currentTicketCategory.availableAmount < ticketInput.amount)
        return res.status(400).json({ message: 'Ticket amount unavailable.' });

    const ticket = await ticketService.createTicket(ticketInput)
    if (!ticket) return res.status(404).json({ message: 'Ticket not created' })

    // for updating tickets availableAmount, 
    // we could use change streams and a replica set on database level
    // but for now, let's use an application level logic
    if (currentTicketCategory)
        await ticketCategoryService.updateCategory(ticketInput.ticketCategory, { availableAmount: currentTicketCategory.availableAmount - ticketInput.amount })

    res.json(ticket)
})

// payments, cancellation, transfer user2user
router.put('/:id', async (req, res) => {
    const ticketInput = validateTicketInput(req.body)
    const ticket = await ticketService.updateTicket(req.params.id, ticketInput)
    if (!ticket) return res.status(404).json({ message: 'Ticket not updated' })

    res.json(ticket)
})

export default router;

