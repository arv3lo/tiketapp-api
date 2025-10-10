import type { IPaginationFields } from "@/common/interfaces";
import type { TicketInput, TTicket } from "@user-ticket/ports/ticket.schema";

export interface ITicketRepository {
    findTickets(filters?: ITicketFilter): Promise<TTicket[]>
    findTicketById(id: string): Promise<TTicket | null>
    findTicketByEventId(eventId: string): Promise<TTicket[]>
    createTicket(ticket: TicketInput): Promise<TTicket>
    updateTicket(id: string, ticket: Partial<TicketInput>): Promise<TTicket | null>
    deleteTicket(id: string): Promise<TTicket | null>
}

export interface ITicketFilter extends IPaginationFields {
    ticketCategory?: string;
    user?: string;
    status?: string;
    // TODO: add creation dates later
    // ...
}
