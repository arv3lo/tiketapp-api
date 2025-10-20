import z from "zod";

import type { IPaginationFields } from "@/common/interfaces";
import type { TTicket } from "@user-ticket/adapters/mongodb/ticket.schema";
import { TICKET_ACTION, TICKET_STATUS } from "@/common/enums";

export interface ITicketRepository {
    findTickets(filters?: ITicketFilter): Promise<TTicket[]>
    findTicketById(id: string): Promise<TTicket | null>
    findTicketByEventId(eventId: string): Promise<TTicket[]>
    
    createTicket(ticket: TicketInput): Promise<TTicket>
    bulkCreateTickets(tickets: TicketInput[]): Promise<TTicket[]>
    
    updateTicket(id: string, ticket: Partial<TicketInput>): Promise<TTicket | null>
    bulkUpdateTickets(ids: string[], payload: Partial<TicketInput>): Promise<TTicket[]>
    
    deleteTicket(id: string): Promise<TTicket | null>
}

export interface ITicketFilter extends IPaginationFields {
    ticketCategory?: string;
    user?: string;
    status?: string;
    // TODO: add creation dates later
    // ...
}

export const ticketInput = z.object({
    _id: z.string().optional(),
    ticketCategory: z.string(),
    user: z.string(),
    status: z.enum(TICKET_STATUS).optional().default(TICKET_STATUS.PENDING),
    amount: z.number().min(1).optional().default(1),
    action: z.enum(TICKET_ACTION).optional().default(TICKET_ACTION.PAYMENT),
})

export type TicketInput = z.infer<typeof ticketInput>
export const validateTicketInput = (input: TicketInput) => ticketInput.parse(input)

export const ticketUpdateInput = z.object({
    action: z.enum(TICKET_ACTION),
    ticketIDs: z.array(z.string()),
    user: z.string()
})

export type TicketUpdateInput = z.infer<typeof ticketUpdateInput>
export const validateTicketUpdateInput = (input: TicketUpdateInput) => ticketUpdateInput.parse(input)