import type { TEvent, TEventInput } from "./event.schema"

export interface EventRepository {
    findEvents(filters?: IEventFilter): Promise<TEvent[]>
    findEventById(id: string): Promise<TEvent | null>
    // for dev purposes only
    bulkCreateEvents(events: TEventInput[]): void
    createEvent(event: TEventInput): Promise<TEvent | null>
    updateEvent(id: string, event: TEventInput): Promise<TEvent | null>
}

export interface IEventFilter {
    name?: string;
    organizers?: string[];
    status?: string;
    type?: string;
}
    