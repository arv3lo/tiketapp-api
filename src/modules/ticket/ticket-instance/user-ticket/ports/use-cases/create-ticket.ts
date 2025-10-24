import { TicketService } from "@user-ticket/ports/ticket.service";
import { MongooseTicketRepo } from "@user-ticket/adapters/mongodb/ticket.repo";
import Ticket, { type TTicket } from "@user-ticket/adapters/mongodb/ticket.schema";
import { TicketCategoryService } from "@user-ticket-category/ports/ticket-category.service";
import { MongooseTicketCategoryRepo } from "@user-ticket-category/adapters/mongodb/ticket-category.repo";
import TicketCategory from "@user-ticket-category/adapters/mongodb/ticket-category.schema";
import type { TicketInput } from "@user-ticket/ports/ticket.port";
import { ERROR_MESSAGE } from "@/common/enums";

const ticketService = new TicketService(new MongooseTicketRepo(Ticket))
const ticketCategoryService = new TicketCategoryService(new MongooseTicketCategoryRepo(TicketCategory))

export const createTicket = async (ticketInput: TicketInput): Promise<TTicket | TTicket[]> => {
    const ticketCategory = await ticketCategoryService.findCategoryById(ticketInput.ticketCategory)
    if (!ticketCategory) throw new Error(ERROR_MESSAGE.INVALID_INPUT)

    if (ticketCategory.availableAmount < ticketInput.amount) throw new Error(ERROR_MESSAGE.INVALID_INPUT)

    let ticket: TTicket | TTicket[]
    if (ticketInput.amount > 1) {
        ticket = await ticketService.bulkCreateTickets(
            Array.from({ length: ticketInput.amount }, () => ticketInput)
        )
    } else {
        ticket = await ticketService.createTicket(ticketInput)
    }
    if (!ticket) throw new Error(ERROR_MESSAGE.NOT_CREATED)

    // for updating tickets availableAmount, 
    // we could use change streams on database level
    // - change streams using eventEmitter
    // - change streams using hasNext function
    // - triggers on mongoDB Atlas
    // but for now, let's use an application level logic
    if (ticketCategory)
        await ticketCategoryService.updateCategory(ticketInput.ticketCategory, { availableAmount: ticketCategory.availableAmount - ticketInput.amount })

    return ticket
}