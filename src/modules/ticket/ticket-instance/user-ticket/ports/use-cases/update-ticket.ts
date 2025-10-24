import { TicketService } from "@user-ticket/ports/ticket.service";
import { MongooseTicketRepo } from "@user-ticket/adapters/mongodb/ticket.repo";
import Ticket from "@user-ticket/adapters/mongodb/ticket.schema";
import type { TicketUpdateInput } from "../ticket.port";
import { ERROR_MESSAGE, TICKET_ACTION, TICKET_STATUS } from "@/common/enums";
import type { TTicket } from "@user-ticket/adapters/mongodb/ticket.schema";

const ticketService = new TicketService(new MongooseTicketRepo(Ticket))

export const updateTicket = async (ticketUpdateInput: TicketUpdateInput): Promise<TTicket | TTicket[]> => {
    let tickets = []
            switch (ticketUpdateInput.action) {
                case TICKET_ACTION.PAYMENT:
                    // send payment transaction to payment.service
                    // if payment successful, update ticket status,
                    tickets = await ticketService.bulkUpdateTickets(
                        ticketUpdateInput.ticketIDs,
                        { status: TICKET_STATUS.PAID }
                    )
                    break;
                case TICKET_ACTION.CANCELATION:
                    // launch a refund process if ticket refund date still not passed
                    // if refund successful, update ticket status, 
                    // update available ticket count
                    const tobeUpdatedTickets = await ticketService.findTickets({ _id: ticketUpdateInput.ticketIDs })
                    if (!tobeUpdatedTickets) throw new Error(ERROR_MESSAGE.NOT_FOUND)
    
                    tobeUpdatedTickets.forEach(async (ticket) => {
                        if (ticket.status !== TICKET_STATUS.PAID) 
                            throw new Error('Ticket must be paid to be cancelled')
                        if (ticket.ticketCategory){
                            // TODO: find a way to update the availableAmount of the ticket category
                            // await ticketCategoryService.updateCategory(ticket.ticketCategory.toString(), { availableAmount: ticketCategoryService.findCategoryById(ticket.ticketCategory.toString()).availableAmount + 1 })
                        }
                    })
    
                    tickets = await ticketService.bulkUpdateTickets(
                        ticketUpdateInput.ticketIDs,
                        { status: TICKET_STATUS.CANCELLED }
                    )
                    break;
                case TICKET_ACTION.TRANSFER:
                    // only paid ticket can be transfered
                    ticketUpdateInput.ticketIDs.forEach(async (ticketID) => {
                        const currentTicket = await ticketService.findTicketById(ticketID)
                        if (!currentTicket) 
                            throw new Error(ERROR_MESSAGE.NOT_FOUND)
                        if (currentTicket.status !== TICKET_STATUS.PAID) 
                            throw new Error('Ticket must be paid to be transfered')
                    })
                    // TRANSFER 2 USER == update ticket user, 
                    // trigger notification for the new user
                    tickets = await ticketService.bulkUpdateTickets(
                        ticketUpdateInput.ticketIDs,
                        { user: ticketUpdateInput.user }
                    )
                    break;
            }
            // ALL THAT should be stored in a history model
            if (!tickets) throw new Error(ERROR_MESSAGE.NOT_UPDATED)

            return tickets
}
    