import { Router } from "express";
import _ from "lodash";

import { EventService } from "./event.service";
import { MongooseEventRepo } from "./adapters/mongoose.event-repo";
import Event, {validateEvent} from "./ports/event.schema";

const eventService = new EventService(new MongooseEventRepo(Event));
const router = Router()

const eventFilters = ["name", "date", "organizers", "status", "type"]
const eventInputFields = [...eventFilters, "description"]
// TODO: handle query params, pagination, sorting, filtering, populating
// get events by organizer, by attented, by artist, by location
router.get('/', async (req, res) => {
    const events = await eventService.findEvents(_.pick(req.query, eventFilters));
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

    res.json(createdEvent);
})

router.put('/:id', async (req, res) => {
    const event = req.body;
    const updatedEvent = await eventService.updateEvent(req.params.id, validateEvent(event));
    if (!updatedEvent) return res.status(404).json({ message: 'Event not updated' });

    res.json(updatedEvent);
})

export default router;