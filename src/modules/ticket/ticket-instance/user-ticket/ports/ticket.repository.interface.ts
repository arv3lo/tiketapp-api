import type { TicketInput, TTicket } from "@user-ticket/ports/ticket.schema";

export interface ITicketRepository {
    findTicketById(id: string): Promise<TTicket | null>
    findTicketByEventId(eventId: string): Promise<TTicket[]>
    createTicket(ticket: TicketInput): Promise<TTicket>
    updateTicket(id: string, ticket: Partial<TicketInput>): Promise<TTicket | null>
    deleteTicket(id: string): Promise<TTicket | null>
}