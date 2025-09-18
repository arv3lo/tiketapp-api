import type { EventRepository, IEventFilter } from "./ports/event-repository.interface";
import type { TEvent, TEventInput } from "./ports/event.schema";

export class EventService {
    constructor(private readonly eventRepository: EventRepository) { }

    async findEvents(filters?: IEventFilter): Promise<TEvent[]> {
        return this.eventRepository.findEvents(filters);
    }

    async findEventById(id: string): Promise<TEvent | null> {
        return this.eventRepository.findEventById(id);
    }

    async createEvent(event: TEventInput): Promise<TEvent | null> {
        return this.eventRepository.createEvent(event);
    }

    async bulkCreateEvents(events: TEventInput[]): Promise<TEvent[] | null> {
        return this.eventRepository.bulkCreateEvents(events);
    }

    async updateEvent(id: string, event: TEventInput): Promise<TEvent | null> {
        return this.eventRepository.updateEvent(id, event);
    }
}