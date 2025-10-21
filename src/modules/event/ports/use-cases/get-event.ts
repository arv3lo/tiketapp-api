import { EventService } from "@event/ports/event.service";
import { MongooseEventRepo } from "@event/adapters/mongodb/event-repo";
import Event from "@event/adapters/mongodb/event.schema";
import { ERROR_MESSAGE } from "@/common/enums";
import type { TEvent } from "@event/adapters/mongodb/event.schema"
import type { IEventFilter } from "@event/ports/event.port"

const eventService = new EventService(new MongooseEventRepo(Event));

export const getEvent = async (id: string): Promise<TEvent> => {
    const event = await eventService.findEventById(id);
    if (!event) throw new Error(ERROR_MESSAGE.NOT_FOUND);

    return event
}

export const getEvents = async (filters?: IEventFilter): Promise<TEvent[]> => {
    const events = await eventService.findEvents(filters);
    if (!events) throw new Error(ERROR_MESSAGE.NOT_FOUND);

    return events
}
    