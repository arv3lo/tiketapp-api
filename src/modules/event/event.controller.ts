import { Router } from "express";
import _ from "lodash";

import { EventService } from "@event/event.service";
import { MongooseEventRepo } from "@event/adapters/mongodb/event-repo";
import Event from "@event/adapters/mongodb/event.schema";
import { validateEvent } from '@event/ports/event.port'
 
import { SetupService } from "@setup/setup.service";
import { MongooseTicketSetupRepo } from "@setup/adapters/mongodb/setup-repo";
import Setup from "@setup/adapters/mongodb/setup.schema";

import { TicketCategoryService } from "@user-ticket-category/ticket-category.service";
import { MongooseTicketCategoryRepo } from "@user-ticket-category/adapters/mongodb/ticket-category.repo";
import TicketCategory from "@user-ticket-category/adapters/mongodb/ticket-category.schema";

const eventService = new EventService(new MongooseEventRepo(Event));
const setupService = new SetupService(new MongooseTicketSetupRepo(Setup));
const ticketCategoryService = new TicketCategoryService(new MongooseTicketCategoryRepo(TicketCategory));
const router = Router()

const eventFilters = ["name", "date", "organizers", "status", "type", "artists", "sponsors"]
const eventInputFields = [...eventFilters, "description"]
// TODO: handle query params, pagination, sorting, filtering, populating
// get events by organizer, by attented, by artist, by location
router.get('/', async (req, res) => {
    const events = await eventService.findEvents(req.query);
    if (!events) return res.status(404).json({ message: 'Events not found' });

    res.json(events);
})

router.get('/:id', async (req, res) => {
    const event = await eventService.findEventById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    res.json(event);
})

router.post('/', async (req, res) => {
    const event = req.body;
    const createdEvent = await eventService.createEvent(validateEvent(event));
    if (!createdEvent) return res.status(404).json({ message: 'Event not created' });

    if (event.ticketSetup) {
        await handleEventTicketSetups(createdEvent._id.toString(), event.ticketSetup);
    }

    res.json(createdEvent);
})

router.put('/:id', async (req, res) => {
    const event = req.body;
    const updatedEvent = await eventService.updateEvent(req.params.id, validateEvent(event));
    if (!updatedEvent) return res.status(404).json({ message: 'Event not updated' });

    res.json(updatedEvent);
})

const handleEventTicketSetups = async (eventID: string, setupID: string) => {
    const currentSetup = await setupService.findTicketSetupById(setupID);
    if (!currentSetup) return null;

    const currentCategories = currentSetup.categories.map((category) => (
        { name: category.name || "", description: category.description || "" }
    ))

    await ticketCategoryService.bulkCreateCategories(
        currentCategories.map(category => ({ ...category, event: eventID, availableAmount: 0 }))
    );

}

export default router;