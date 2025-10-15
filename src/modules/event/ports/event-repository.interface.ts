import type { IPaginationFields } from "@/common/interfaces"
import type { TEvent, TEventInput } from "../adapters/mongodb/event.schema"

export interface EventRepository {
    findEvents(filters?: IEventFilter): Promise<TEvent[]>
    findEventById(id: string): Promise<TEvent | null>
    // for dev purposes only
    bulkCreateEvents(events: TEventInput[]): Promise<TEvent[] | null>
    createEvent(event: TEventInput): Promise<TEvent | null>
    updateEvent(id: string, event: TEventInput): Promise<TEvent | null>
}

export interface IEventFilter extends IPaginationFields {
    name?: string;
    organizers?: string[];
    status?: string;
    type?: string;
}
