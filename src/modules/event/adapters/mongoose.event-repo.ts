import type { EventRepository } from "../ports/event-repository.interface";
import Event, { type TEvent, type TEventInput } from "../ports/event.schema";

export class MongooseEventRepo implements EventRepository {
    constructor(private readonly event: typeof Event) { }

    findEvents(): Promise<TEvent[]> {
        return this.event.find();
    }
    findEventById(id: string): Promise<TEvent | null> {
        return this.event.findById(id);
    }
    createEvent(event: TEventInput): Promise<TEvent | null> {
        return this.event.create(event);
    }
    bulkCreateEvents(events: TEventInput[]): Promise<TEvent[] | null> {
        return this.event.insertMany(events);
    }
    updateEvent(id: string, event: TEventInput): Promise<TEvent | null> {
        return this.event.findByIdAndUpdate(id, event);
    }
}