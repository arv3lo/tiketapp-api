import type { TicketSetupRepository } from "@setup/ports/setup.repository.interface";
import TicketSetup, { type TicketSetupInput, type TTicketSetup } from "@setup/ports/setup.schema";

const populatedOrganizerFields = ['fullname', '_id']
const populatedCategoriesFields = ['name', '_id']

export class MongooseTicketSetupRepo implements TicketSetupRepository {
    constructor(private readonly ticketSetup: typeof TicketSetup) { }

    findTicketSetupById(id: string): Promise<TTicketSetup | null> {
        return this.ticketSetup.findById(id)
            .populate('organizer', populatedOrganizerFields)
            .populate('categories', populatedCategoriesFields);
    }

    findTicketSetupByOrganizerId(organizerId: string): Promise<TTicketSetup | null> {
        return this.ticketSetup.findOne({ organizer: organizerId })
            .populate('organizer', populatedOrganizerFields)
            .populate('categories', populatedCategoriesFields);
    }

    createTicketSetup(ticketSetup: TicketSetupInput): Promise<TTicketSetup> {
        return this.ticketSetup.create(ticketSetup);
    }

    updateTicketSetup(id: string, ticketSetup: TicketSetupInput): Promise<TTicketSetup | null> {
        return this.ticketSetup.findByIdAndUpdate(id, ticketSetup, { new: true });
    }

    deleteTicketSetup(id: string): Promise<TTicketSetup | null> {
        return this.ticketSetup.findByIdAndDelete(id);
    }
}