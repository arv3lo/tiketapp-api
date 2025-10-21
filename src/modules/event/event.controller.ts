import { Router } from "express";
import _ from "lodash";

import { validateEvent } from '@event/ports/event.port'
import { ERROR_MESSAGE } from "@/common/enums";
import { createEvent } from "@event/ports/use-cases/create-event";
import { updateEvent } from "@event/ports/use-cases/update-event";
import { getEvent, getEvents } from "./ports/use-cases/get-event";

const router = Router()

router.get('/', async (req, res) => {
    try {
        const events = await getEvents(req.query);

        res.json(events);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : ERROR_MESSAGE.UNKNOWN_ERROR
        res.status(400).json({ message: errorMessage });
    }
})

router.get('/:id', async (req, res) => {
    try {
        const event = await getEvent(req.params.id);

        res.json(event);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : ERROR_MESSAGE.UNKNOWN_ERROR
        res.status(400).json({ message: errorMessage });
    }
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