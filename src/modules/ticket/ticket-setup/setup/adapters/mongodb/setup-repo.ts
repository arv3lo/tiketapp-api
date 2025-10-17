import type { PopulatedTicketSetup } from "@/common/types";
import type { TUser } from "@user/adapters/mongodb/user.schema";
import type { TicketSetupRepository } from "@/modules/ticket/ticket-setup/setup/ports/setup.port";
import TicketSetup, { type TicketSetupInput, type TTicketSetup } from "@setup/adapters/mongodb/setup.schema";
import type { TCategory } from "@category/adapters/mongodb/category.schema";

const populatedOrganizerFields = ['fullname', '_id']
const populatedCategoriesFields = ['name', '_id']

export class MongooseTicketSetupRepo implements TicketSetupRepository {
    constructor(private readonly ticketSetup: typeof TicketSetup) { }

    findTicketSetupById(id: string): Promise<PopulatedTicketSetup | null> {
        return this.ticketSetup.findById(id)
            .populate<{ organizer: TUser }>('organizer', populatedOrganizerFields)
            .populate<{ categories: TCategory[] }>('categories', populatedCategoriesFields)
            .lean();
    }

    findTicketSetupByOrganizerId(organizerId: string): Promise<PopulatedTicketSetup | null> {
        return this.ticketSetup.findOne({ organizer: organizerId })
            .populate<{ organizer: TUser }>('organizer', populatedOrganizerFields)
            .populate<{ categories: TCategory[] }>('categories', populatedCategoriesFields)
            .lean();
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