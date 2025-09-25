import type { ITicketRepository } from "@user-ticket/ports/ticket.repository.interface";
import Ticket, { type TTicket, type TicketInput } from "@user-ticket/ports/ticket.schema";

export class MongooseTicketRepo implements ITicketRepository {
    constructor(private readonly ticket: typeof Ticket) { }

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