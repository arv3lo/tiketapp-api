import type { PopulatedTicketSetup } from "@/common/types";
import type { TicketSetupRepository, TicketSetupInput } from "@setup/ports/setup.port";
import type { TTicketSetup } from "@setup/adapters/mongodb/setup.schema";

export class SetupService {
    constructor(private readonly setupRepository: TicketSetupRepository) { }

    async findTicketSetupById(id: string): Promise<PopulatedTicketSetup | null> {
        return this.setupRepository.findTicketSetupById(id);
    }

    async findTicketSetupByOrganizerId(organizerId: string): Promise<PopulatedTicketSetup | null> {
        return this.setupRepository.findTicketSetupByOrganizerId(organizerId);
    }

    async createTicketSetup(ticketSetup: TicketSetupInput): Promise<TTicketSetup> {
        return this.setupRepository.createTicketSetup(ticketSetup);
    }

    async updateTicketSetup(id: string, ticketSetup: TicketSetupInput): Promise<TTicketSetup | null> {
        return this.setupRepository.updateTicketSetup(id, ticketSetup);
    }

    async deleteTicketSetup(id: string): Promise<TTicketSetup | null> {
        return this.setupRepository.deleteTicketSetup(id);
    }
}