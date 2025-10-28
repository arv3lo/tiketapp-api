import z from "zod"

import { EVENT_STATUS, EVENT_TYPE } from "@/common/enums";
import type { IPaginationFields } from "@/common/interfaces"
import type { TEvent } from "@event/adapters/mongodb/event.schema"

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

export const eventInput = z.object({
    name: z.string().min(3).max(100),
    // location: z.string().min(3).max(100),
    startDate: z.date(), // .optional().default(new Date()), // optional for dev purpose only
    endDate: z.date().optional(),
    description: z.string().min(3).max(100),
    status: z.enum(EVENT_STATUS).default(EVENT_STATUS.DRAFT),
    type: z.enum(EVENT_TYPE).default(EVENT_TYPE.CONCERT),
    organizers: z.array(z.string()).min(1),
    artists: z.array(z.string()).optional(),
    // sponsors: z.array(z.string()),
    // o: none, 1: existing setup, 2: new setup
    ticketSetup: z.string().optional(),
    image: z.string().optional()
});

export type TEventInput = z.infer<typeof eventInput>
export const validateEvent = (event: TEventInput) => eventInput.parse(event)
