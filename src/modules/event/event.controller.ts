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
import { ERROR_MESSAGE } from "@/common/enums";

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
    if (!events) return res.status(404).json({ message: ERROR_MESSAGE.NOT_FOUND });

    res.json(events);
})

router.get('/:id', async (req, res) => {
    const event = await eventService.findEventById(req.params.id);
    if (!event) return res.status(404).json({ message: ERROR_MESSAGE.NOT_FOUND });

    res.json(event);
})

router.post('/', async (req, res) => {
    try {
        const eventInput = validateEvent(req.body);
        const createdEvent = await eventService.createEvent(eventInput);
        if (!createdEvent) return res.status(404).json({ message: ERROR_MESSAGE.NOT_CREATED });
    
        if (eventInput.ticketSetup) {
            await handleEventTicketSetups(createdEvent._id.toString(), eventInput.ticketSetup);
        }
    
        res.status(200).json(createdEvent);
    } catch (error) {
        res.status(400).json({ message: ERROR_MESSAGE.INVALID_INPUT });
    }
})

router.put('/:id', async (req, res) => {
    try {
        const eventInput = validateEvent(req.body);
        const updatedEvent = await eventService.updateEvent(req.params.id, eventInput);
        if (!updatedEvent) return res.status(404).json({ message: ERROR_MESSAGE.NOT_UPDATED });
    
        res.status(200).json(updatedEvent);
    } catch (error) {
        res.status(400).json({ message: ERROR_MESSAGE.INVALID_INPUT });
    }
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