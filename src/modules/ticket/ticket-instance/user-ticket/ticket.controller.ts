import { Router } from "express";

import { ERROR_MESSAGE } from "@/common/enums";
import { TicketService } from "@user-ticket/ticket.service";
import { MongooseTicketRepo } from "@user-ticket/adapters/mongodb/ticket.repo";
import Ticket from "@user-ticket/adapters/mongodb/ticket.schema";
import { validateTicketInput, validateTicketUpdateInput } from "@user-ticket/ports/ticket.port";
import { createTicket } from "@user-ticket/ports/use-cases/create-ticket";
import { updateTicket } from "@user-ticket/ports/use-cases/update-ticket";


const router = Router()
const ticketService = new TicketService(new MongooseTicketRepo(Ticket))

// get tickets by categoryID, userID, status, dates, etc.
router.get('/', async (req, res) => {
    const tickets = await ticketService.findTickets(req.query)
    if (!tickets) return res.status(404).json({ message: ERROR_MESSAGE.NOT_FOUND })

    res.status(200).json(tickets)
})

router.get('/:id', async (req, res) => {
    const ticket = await ticketService.findTicketById(req.params.id)
    if (!ticket) return res.status(404).json({ message: ERROR_MESSAGE.NOT_FOUND })

    res.status(200).json(ticket)
})

router.post('/', async (req, res) => {
    try {
        const ticketInput = validateTicketInput(req.body)
        const ticket = await createTicket(ticketInput)

        res.status(200).json(ticket)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

router.put('/', async (req, res) => {
    try {
        const ticketInput = validateTicketUpdateInput(req.body)
        const tickets = await updateTicket(ticketInput)

        res.status(200).json(tickets)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

export default router;

