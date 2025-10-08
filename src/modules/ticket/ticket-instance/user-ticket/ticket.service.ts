import type { ITicketRepository } from "@user-ticket/ports/ticket.repository.interface";
import type { TTicket, TicketInput } from "@user-ticket/ports/ticket.schema";

export class TicketService {
    constructor(private readonly ticketRepository: ITicketRepository) { }

    async findTicketById(id: string): Promise<TTicket | null> {
        return this.ticketRepository.findTicketById(id)
    }

    // TODO: this one should be sold ticket count for an event
    async findTicketByEventId(eventId: string): Promise<TTicket[]> {
        return this.ticketRepository.findTicketByEventId(eventId)
    }

    async createTicket(ticket: TicketInput): Promise<TTicket> {
        return this.ticketRepository.createTicket(ticket)
    }

    async updateTicket(id: string, ticket: Partial<TicketInput>): Promise<TTicket | null> {
        return this.ticketRepository.updateTicket(id, ticket)
    }

    async deleteTicket(id: string): Promise<TTicket | null> {
        return this.ticketRepository.deleteTicket(id)
    }
}