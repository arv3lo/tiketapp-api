import { ERROR_MESSAGE } from "@/common/enums";

import { EventService } from "@event/ports/event.service";
import { MongooseEventRepo } from "@event/adapters/mongodb/event-repo";
import Event, { type TEvent } from "@event/adapters/mongodb/event.schema";
import type { TEventInput } from "@event/ports/event.port";

const eventService = new EventService(new MongooseEventRepo(Event));

export const updateEvent = async (id: string, eventInput: TEventInput): Promise<TEvent> => {
    const updatedEvent = await eventService.updateEvent(id, eventInput);
    if (!updatedEvent) throw new Error(ERROR_MESSAGE.NOT_UPDATED);
    
    return updatedEvent
}