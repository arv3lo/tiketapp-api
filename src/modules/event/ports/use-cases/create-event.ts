import { ERROR_MESSAGE } from "@/common/enums";

import { EventService } from "@event/ports/event.service";
import { MongooseEventRepo } from "@event/adapters/mongodb/event-repo";
import Event, { type TEvent } from "@event/adapters/mongodb/event.schema";
import type { TEventInput } from "@event/ports/event.port";

import { SetupService } from "@setup/setup.service";
import { MongooseTicketSetupRepo } from "@setup/adapters/mongodb/setup-repo";
import Setup from "@setup/adapters/mongodb/setup.schema";

import { TicketCategoryService } from "@user-ticket-category/ports/ticket-category.service";
import { MongooseTicketCategoryRepo } from "@user-ticket-category/adapters/mongodb/ticket-category.repo";
import TicketCategory from "@user-ticket-category/adapters/mongodb/ticket-category.schema";

const eventService = new EventService(new MongooseEventRepo(Event));
const setupService = new SetupService(new MongooseTicketSetupRepo(Setup));
const ticketCategoryService = new TicketCategoryService(new MongooseTicketCategoryRepo(TicketCategory));

export const createEvent = async (eventInput: TEventInput): Promise<TEvent> => {
    const createdEvent = await eventService.createEvent(eventInput);
    if (!createdEvent) throw new Error(ERROR_MESSAGE.NOT_CREATED);
    
    if (eventInput.ticketSetup) {
        await handleEventTicketSetups(createdEvent._id.toString(), eventInput.ticketSetup);
    }

    return createdEvent
}

const handleEventTicketSetups = async (eventID: string, setupID: string) => {
    const currentSetup = await setupService.findTicketSetupById(setupID);
    if (!currentSetup) return null;

    const currentCategories = currentSetup.categories.map((category) => (
        { name: category.name || "", description: category.description || "" }
    ))

    await ticketCategoryService.bulkCreateCategories(
        currentCategories.map(category => ({ ...category, event: eventID, availableAmount: 0 }))
    );
}