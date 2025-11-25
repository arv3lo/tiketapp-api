import { describe, it, expect, mock } from "bun:test";
import { EventService } from "../src/modules/event/ports/event.service";
import type { EventRepository, TEventInput } from "../src/modules/event/ports/event.port";
import type { TEvent } from "../src/modules/event/adapters/mongodb/event.schema";

describe("EventService", () => {
    const eventRepositoryMock: EventRepository = {
        findEvents: mock(() => Promise.resolve([])),
        findEventById: mock((id: string) => Promise.resolve({} as TEvent)),
        createEvent: mock((event: TEventInput) => Promise.resolve({} as TEvent)),
        bulkCreateEvents: mock((events: TEventInput[]) => Promise.resolve([] as TEvent[])),
        updateEvent: mock((id: string, event: TEventInput) => Promise.resolve({} as TEvent)),
    };

    const eventService = new EventService(eventRepositoryMock);

    it("should find events", async () => {
        await eventService.findEvents();
        expect(eventRepositoryMock.findEvents).toHaveBeenCalled();
    });

    it("should find event by id", async () => {
        await eventService.findEventById("1");
        expect(eventRepositoryMock.findEventById).toHaveBeenCalledWith("1");
    });

    it("should create an event", async () => {
        const event: TEventInput = { name: "test", date: new Date(), description: "test", location: "test", airdropAmount: 100, remainingAirdrop: 100 };
        await eventService.createEvent(event);
        expect(eventRepositoryMock.createEvent).toHaveBeenCalledWith(event);
    });

    it("should bulk create events", async () => {
        const events: TEventInput[] = [{ name: "test", date: new Date(), description: "test", location: "test", airdropAmount: 100, remainingAirdrop: 100 }];
        await eventService.bulkCreateEvents(events);
        expect(eventRepositoryMock.bulkCreateEvents).toHaveBeenCalledWith(events);
    });

    it("should update an event", async () => {
        const event: TEventInput = { name: "test", date: new Date(), description: "test", location: "test", airdropAmount: 100, remainingAirdrop: 100 };
        await eventService.updateEvent("1", event);
        expect(eventRepositoryMock.updateEvent).toHaveBeenCalledWith("1", event);
    });
});
