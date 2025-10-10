import type { ITicketFilter, ITicketRepository } from "@user-ticket/ports/ticket.repository.interface";
import Ticket, { type TTicket, type TicketInput } from "@user-ticket/ports/ticket.schema";

export class MongooseTicketRepo implements ITicketRepository {
    constructor(private readonly ticket: typeof Ticket) { }

    async findTickets(filters?: ITicketFilter): Promise<TTicket[]> {
        return this.ticket.find(formatFilters(filters || {}))
            .populate({
                path: 'ticketCategory',
                select: 'name event',
                populate: { path: 'event', select: 'name date type' }
            })
            .populate({ path: 'user', select: 'fullname role' })
            .lean()
    }

    async findTicketById(id: string): Promise<TTicket | null> {
        return this.ticket.findById(id)
    }

    async findTicketByEventId(eventId: string): Promise<TTicket[]> {
        return this.ticket.find({ event: eventId })
    }

    async createTicket(ticket: TicketInput): Promise<TTicket> {
        return this.ticket.create(ticket)
    }

    async updateTicket(id: string, ticket: Partial<TicketInput>): Promise<TTicket | null> {
        return this.ticket.findByIdAndUpdate(id, ticket, { new: true })
    }

    async deleteTicket(id: string): Promise<TTicket | null> {
        return this.ticket.findByIdAndDelete(id)
    }
}

const formatFilters = (filters: ITicketFilter) => {
    // in case we need paginations, we put these filters here
    const { limit, page, sort, order, ...rest } = filters
    return { ...rest }
}