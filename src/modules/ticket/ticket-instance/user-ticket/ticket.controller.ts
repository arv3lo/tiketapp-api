import { Router } from "express";

import { TicketService } from "@user-ticket/ticket.service";
import { MongooseTicketRepo } from "@user-ticket/adapters/mongodb/ticket.repo";
import Ticket from "@user-ticket/adapters/mongodb/ticket.schema";
import { validateTicketInput, validateTicketUpdateInput } from "@/modules/ticket/ticket-instance/user-ticket/ports/ticket.port";
import { TicketCategoryService } from "@user-ticket-category/ticket-category.service";
import { MongooseTicketCategoryRepo } from "@user-ticket-category/adapters/mongodb/ticket-category.repo";
import TicketCategory from "@user-ticket-category/adapters/mongodb/ticket-category.schema";
import { ERROR_MESSAGE, TICKET_ACTION, TICKET_STATUS } from "@/common/enums";

const router = Router()
const ticketService = new TicketService(new MongooseTicketRepo(Ticket))
const ticketCategoryService = new TicketCategoryService(new MongooseTicketCategoryRepo(TicketCategory))

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
        const currentTicketCategory = await ticketCategoryService.findCategoryById(ticketInput.ticketCategory)

        if (currentTicketCategory && currentTicketCategory.availableAmount < ticketInput.amount)
            return res.status(400).json({ message: ERROR_MESSAGE.NOT_FOUND }); // ticket amount unavailable

        let ticket = undefined
        if (ticketInput.amount > 1) {
            ticket = await ticketService.bulkCreateTickets(
                Array.from({ length: ticketInput.amount }, () => ticketInput)
            )
        } else {
            ticket = await ticketService.createTicket(ticketInput)
        }
        if (!ticket) return res.status(404).json({ message: ERROR_MESSAGE.NOT_CREATED })

        // for updating tickets availableAmount, 
        // we could use change streams on database level
        // - change streams using eventEmitter
        // - change streams using hasNext function
        // - triggers on mongoDB Atlas
        // but for now, let's use an application level logic
        if (currentTicketCategory)
            await ticketCategoryService.updateCategory(ticketInput.ticketCategory, { availableAmount: currentTicketCategory.availableAmount - ticketInput.amount })

        res.status(200).json(ticket)
    } catch (error) {
        res.status(400).json({ message: ERROR_MESSAGE.INVALID_INPUT })
    }
})

router.put('/', async (req, res) => {
    try {
        const ticketInput = validateTicketUpdateInput(req.body)

        let tickets = []
        switch (ticketInput.action) {
            case TICKET_ACTION.PAYMENT:
                // send payment transaction to payment.service
                // if payment successful, update ticket status,
                tickets = await ticketService.bulkUpdateTickets(
                    ticketInput.ticketIDs,
                    { status: TICKET_STATUS.PAID }
                )
                break;
            case TICKET_ACTION.CANCELATION:
                // launch a refund process if ticket refund date still not passed
                // if refund successful, update ticket status, 
                // update available ticket count
                tickets = await ticketService.bulkUpdateTickets(
                    ticketInput.ticketIDs,
                    { status: TICKET_STATUS.CANCELLED }
                )
                break;
            case TICKET_ACTION.TRANSFER:
                // only paid ticket can be transfered
                // if we assume that ticket transfer is not a frequently used feature
                // so we don't need to implement a specific endpoint for it
                // let's just find the ticket first and check if it's already paid or not
                ticketInput.ticketIDs.forEach(async (ticketID) => {
                    const currentTicket = await ticketService.findTicketById(ticketID)
                    if (!currentTicket) return res.status(404).json({ message: ERROR_MESSAGE.NOT_FOUND })
                    if (currentTicket.status !== TICKET_STATUS.PAID) return res.status(400).json({ message: 'Ticket must be paid to be transfered' }) // specific error message
                })
                // TRANSFER 2 USER == update ticket user, 
                // trigger notification for the new user
                tickets = await ticketService.bulkUpdateTickets(
                    ticketInput.ticketIDs,
                    { user: ticketInput.user }
                )
                break;
        }
        // ALL THAT should be stored in a history model
        if (!tickets) return res.status(404).json({ message: ERROR_MESSAGE.NOT_UPDATED })

        res.status(200).json(tickets)
    } catch (error) {
        res.status(400).json({ message: ERROR_MESSAGE.INVALID_INPUT })
    }
})

export default router;

