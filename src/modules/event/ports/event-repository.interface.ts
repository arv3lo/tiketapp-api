import type { TEvent, TEventInput } from "./event.schema"

export interface EventRepository {
    findEvents(): Promise<TEvent[]>
    findEventById(id: string): Promise<TEvent | null>
    // for dev purposes only
    bulkCreateEvents(events: TEventInput[]): Promise<TEvent[] | null>
    createEvent(event: TEventInput): Promise<TEvent | null>
    updateEvent(id: string, event: TEventInput): Promise<TEvent | null>
}