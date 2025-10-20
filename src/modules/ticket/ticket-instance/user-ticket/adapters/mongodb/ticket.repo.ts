import type { ITicketFilter, ITicketRepository, TicketInput } from "@/modules/ticket/ticket-instance/user-ticket/ports/ticket.port";
import Ticket, { type TTicket } from "@user-ticket/adapters/mongodb/ticket.schema";

export class MongooseTicketRepo implements ITicketRepository {
    constructor(private readonly ticket: typeof Ticket) { }

    async findTickets(filters?: ITicketFilter): Promise<TTicket[]> {
        return this.ticket.find(filters ? formatFilters(filters || {}) : {})
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
            .populate({
                path: 'ticketCategory',
                select: 'name event',
                populate: { path: 'event', select: 'name date type' }
            })
            .populate({ path: 'user', select: 'fullname role' })
            .lean()
    }

    async findTicketByEventId(eventId: string): Promise<TTicket[]> {
        return this.ticket.find({ event: eventId })
            .populate({
                path: 'ticketCategory',
                select: 'name event',
                populate: { path: 'event', select: 'name date type' }
            })
            .populate({ path: 'user', select: 'fullname role' })
    }

    async createTicket(ticket: TicketInput): Promise<TTicket> {
        return this.ticket.create(ticket)
    }

    async bulkCreateTickets(tickets: TicketInput[]): Promise<TTicket[]> {
        const createdTickets = await this.ticket.insertMany(tickets);
        return createdTickets.map(doc => doc.toObject() as unknown as TTicket);
    }

    async updateTicket(id: string, ticket: Partial<TicketInput>): Promise<TTicket | null> {
        return this.ticket.findByIdAndUpdate(id, ticket, { new: true })
    }

    async bulkUpdateTickets(ids: string[], payload: Partial<TicketInput>): Promise<TTicket[]> {
        const updatedOnes = await this.ticket
            .updateMany({ _id: { $in: ids } }, { ...payload })

        if (updatedOnes.modifiedCount === ids.length) {
            // it would be better to return updated tickets
            // if we assume that a single user will not buy more than 100 tickets
            // we can find the updated tickets and return them without consuming too much memory
            return this.ticket.find({ _id: { $in: ids } }).lean()
        }

        return []
    }

    async deleteTicket(id: string): Promise<TTicket | null> {
        return this.ticket.findByIdAndDelete(id)
    }
}

const formatFilters = (filters: ITicketFilter) => {
    // in case we need paginations, we put these filters here
    const { limit, page, sort, order, _id, ...rest } = filters
    return { _id: { $in: _id }, ...rest }
}