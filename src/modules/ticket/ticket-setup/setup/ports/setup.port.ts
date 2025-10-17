import z from "zod"

import type { PopulatedTicketSetup } from "@/common/types";
import type { TTicketSetup } from "@setup/adapters/mongodb/setup.schema";

export interface TicketSetupRepository {
    findTicketSetupById(id: string): Promise<PopulatedTicketSetup | null>
    findTicketSetupByOrganizerId(organizerId: string): Promise<PopulatedTicketSetup | null>
    createTicketSetup(ticketSetup: TicketSetupInput): Promise<TTicketSetup>
    updateTicketSetup(id: string, ticketSetup: TicketSetupInput): Promise<TTicketSetup | null>
    deleteTicketSetup(id: string): Promise<TTicketSetup | null>
}

export const ticketSetupInput = z.object({
    name: z.string().min(3).max(100),
    description: z.string().optional(),
    organizer: z.string(),
    categories: z.array(z.string())
})

export type TicketSetupInput = z.infer<typeof ticketSetupInput>
export const validateTicketSetupInput = (input: TicketSetupInput) =>
    ticketSetupInput.parse(input)