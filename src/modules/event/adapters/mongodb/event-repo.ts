import type { EventRepository, IEventFilter, TEventInput } from "@event/ports/event.port";
import Event, { type TEvent } from "@event/adapters/mongodb/event.schema";

const populateFields = ['fullname', 'email', '_id']

export class MongooseEventRepo implements EventRepository {
    constructor(private readonly event: typeof Event) { }
    
    findEvents(filters?: IEventFilter): Promise<TEvent[]> {
        return this.event.find(formatFilter(filters || {}))
            .skip(((filters?.page || 1) - 1) * (filters?.limit || 10))
            .limit(filters?.limit || 10)
            .sort({ [filters?.sort || 'createdAt']: filters?.order === "asc" ? 1 : -1 })
            .populate('organizers', populateFields)
            .populate('artists', populateFields)
            // .populate('sponsors', populateFields);
    }
    findEventById(id: string): Promise<TEvent | null> {
        return this.event.findById(id)
            .populate('organizers', populateFields)
            .populate('artists', populateFields)
            // .populate('sponsors', populateFields);
    }
    createEvent(event: TEventInput): Promise<TEvent | null> {
        return this.event.create(event);
    }
    async bulkCreateEvents(events: TEventInput[]): Promise<TEvent[] | null> {
        const createdEvents = await this.event.insertMany(events);
        return createdEvents.map(doc => doc.toObject() as unknown as TEvent);
    }
    updateEvent(id: string, event: TEventInput): Promise<TEvent | null> {
        return this.event.findByIdAndUpdate(id, event, { new: true });
    }
}

// only complex filters goes here
const formatFilter = (filters: IEventFilter) => {
    const nameFilter = filters.name ? { name: { $regex: filters.name, $options: "i" } } : {};
    const organizersFilter = filters.organizers ? { organizers: { $in: filters.organizers } } : {};
    const { limit, page, sort, order, ...rest } = filters

    return { ...rest, ...nameFilter, ...organizersFilter }
}