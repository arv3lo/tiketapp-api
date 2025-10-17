import { Router } from "express";

import { TicketService } from "@user-ticket/ticket.service";
import { MongooseTicketRepo } from "@user-ticket/adapters/mongodb/ticket.repo";
import Ticket from "@user-ticket/adapters/mongodb/ticket.schema";
import { validateTicketInput } from "@user-ticket/ports/ticket.repository.interface";

import { TicketCategoryService } from "@user-ticket-category/ticket-category.service";
import { MongooseTicketCategoryRepo } from "@user-ticket-category/adapters/mongodb/ticket-category.repo";
import TicketCategory from "@user-ticket-category/adapters/mongodb/ticket-category.schema";
import { TICKET_ACTION, TICKET_STATUS } from "@/common/enums";

const router = Router()
const ticketService = new TicketService(new MongooseTicketRepo(Ticket))
const ticketCategoryService = new TicketCategoryService(new MongooseTicketCategoryRepo(TicketCategory))

// get tickets by categoryID, userID, status, dates, etc.
router.get('/', async (req, res) => {
    const tickets = await ticketService.findTickets(req.query)
    if (!tickets) return res.status(404).json({ message: 'Tickets not found' })

    res.status(200).json(tickets)
})

router.get('/:id', async (req, res) => {
    const ticket = await ticketService.findTicketById(req.params.id)
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' })

    res.status(200).json(ticket)
})

router.post('/', async (req, res) => {
    const ticketInput = validateTicketInput(req.body)
    const currentTicketCategory = await ticketCategoryService.findCategoryById(ticketInput.ticketCategory)

    if (currentTicketCategory && currentTicketCategory.availableAmount < ticketInput.amount)
        return res.status(400).json({ message: 'Ticket amount unavailable.' });

    const ticket = await ticketService.createTicket(ticketInput)
    if (!ticket) return res.status(404).json({ message: 'Ticket not created' })

    // for updating tickets availableAmount, 
    // we could use change streams on database level
    // - change streams using eventEmitter
    // - change streams using hasNext function
    // - triggers on mongoDB Atlas
    // but for now, let's use an application level logic
    if (currentTicketCategory)
        await ticketCategoryService.updateCategory(ticketInput.ticketCategory, { availableAmount: currentTicketCategory.availableAmount - ticketInput.amount })

    res.status(200).json(ticket)
})

router.put('/:id', async (req, res) => {
    const ticketInput = validateTicketInput(req.body)
    
    let ticket = undefined
    switch (ticketInput.action) {
        case TICKET_ACTION.PAYMENT:
            // send payment transaction to payment.service
            // if payment successful, update ticket status, 
            ticket = await ticketService.updateTicket(req.params.id, { status: TICKET_STATUS.PAID })
            break;
        case TICKET_ACTION.CANCELATION:
            // launch a refund process if ticket refund date still not passed
            // if refund successful, update ticket status, 
            // update available ticket count
            ticket = await ticketService.updateTicket(req.params.id, { status: TICKET_STATUS.CANCELLED })
            break;
        case TICKET_ACTION.TRANSFER:
            // only paid ticket can be transfered
            // if we assume that ticket transfer is not a frequently used feature
            // so we don't need to implement a specific endpoint for it
            // let's just find the ticket first and check if it's already paid or not
            ticket = await ticketService.findTicketById(req.params.id)
            if (!ticket) return res.status(404).json({ message: 'Ticket not found' })
            if (ticket.status !== TICKET_STATUS.PAID) return res.status(400).json({ message: 'Ticket must be paid to be transfered' })
            // TRANSFER 2 USER == update ticket user, 
            // trigger notification for the new user
            ticket = await ticketService.updateTicket(req.params.id, { user: ticketInput.user })
            break;
    }
    // ALL THAT should be stored in a history model
    if (!ticket) return res.status(404).json({ message: 'Ticket not updated' })

    res.status(200).json(ticket)
})


export default router;

