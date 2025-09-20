import type { TicketSetupInput, TTicketSetup } from "./setup.schema";

export interface TicketSetupRepository {
    findTicketSetupById(id: string): Promise<TTicketSetup | null>
    findTicketSetupByOrganizerId(organizerId: string): Promise<TTicketSetup[]>
    createTicketSetup(ticketSetup: TicketSetupInput): Promise<TTicketSetup>
    updateTicketSetup(id: string, ticketSetup: TicketSetupInput): Promise<TTicketSetup | null>
    deleteTicketSetup(id: string): Promise<TTicketSetup | null>
}