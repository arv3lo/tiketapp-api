import type { ITicketFilter, ITicketRepository, TicketInput } from "@user-ticket/ports/ticket.repository.interface";
import type { TTicket } from "@user-ticket/adapters/mongodb/ticket.schema";

export class TicketService {
    constructor(private readonly ticketRepository: ITicketRepository) { }

    async findTickets(filters?: ITicketFilter): Promise<TTicket[]> {
        return this.ticketRepository.findTickets(filters)
    }

    async findTicketById(id: string): Promise<TTicket | null> {
        return this.ticketRepository.findTicketById(id)
    }

    // TODO: this one should also return sold ticket count for an event
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