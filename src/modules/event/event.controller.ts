import { Router } from "express";
import _ from "lodash";

import { EventService } from "@event/event.service";
import { MongooseEventRepo } from "@event/adapters/mongodb/event-repo";
import Event from "@event/adapters/mongodb/event.schema";
import { validateEvent } from '@event/ports/event.port'
import { ERROR_MESSAGE } from "@/common/enums";
import { createEvent } from "@event/ports/use-cases/create-event";
import { updateEvent } from "@event/ports/use-cases/update-event";

const eventService = new EventService(new MongooseEventRepo(Event));
const router = Router()

// const eventFilters = ["name", "date", "organizers", "status", "type", "artists", "sponsors"]
// const eventInputFields = [...eventFilters, "description"]
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
        const createdEvent = await createEvent(eventInput)

        res.status(200).json(createdEvent);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : ERROR_MESSAGE.UNKNOWN_ERROR
        res.status(400).json({ message: errorMessage });
    }
})

router.put('/:id', async (req, res) => {
    try {
        const eventInput = validateEvent(req.body);
        const updatedEvent = await updateEvent(req.params.id, eventInput)

        res.status(200).json(updatedEvent);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : ERROR_MESSAGE.UNKNOWN_ERROR
        res.status(400).json({ message: errorMessage });
    }
})

export default router;