import type { PopulatedTicketSetup } from "@/common/types";
import type { TicketSetupInput, TTicketSetup } from "@setup/adapters/mongodb/setup.schema";

export interface TicketSetupRepository {
    findTicketSetupById(id: string): Promise<PopulatedTicketSetup | null>
    findTicketSetupByOrganizerId(organizerId: string): Promise<PopulatedTicketSetup | null>
    createTicketSetup(ticketSetup: TicketSetupInput): Promise<TTicketSetup>
    updateTicketSetup(id: string, ticketSetup: TicketSetupInput): Promise<TTicketSetup | null>
    deleteTicketSetup(id: string): Promise<TTicketSetup | null>
}