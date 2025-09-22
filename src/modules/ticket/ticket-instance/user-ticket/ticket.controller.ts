import { Router } from "express";

import { TicketService } from "@user-ticket/ticket.service";
import { MongooseTicketRepo } from "@user-ticket/adapters/mongoose.ticket.repo";
import Ticket, { validateTicketInput } from "@user-ticket/ports/ticket.schema";

const router = Router()
const ticketService = new TicketService(new MongooseTicketRepo(Ticket))

// get tickets by eventID, userID, status, dates, etc.
router.get('/', async (req, res) => {
    // TODO: check the following line
    const tickets = await ticketService.findTicketByEventId(req.query.eventId as string)
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
    const ticket = await ticketService.createTicket(ticketInput)
    if (!ticket) return res.status(404).json({ message: 'Ticket not created' })

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

