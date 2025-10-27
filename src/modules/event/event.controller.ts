import { Router } from "express";
import _ from "lodash";

import { validateEvent } from '@event/ports/event.port'
import { createEvent } from "@event/ports/use-cases/create-event";
import { updateEvent } from "@event/ports/use-cases/update-event";
import { getEvent, getEvents } from "@event/ports/use-cases/get-event";
import { ERROR_MESSAGE } from "@/common/enums";
import { upload } from "@/middlewares/file-upload";

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

        // return res.status(201).json({
        //     message: "File uploaded successfully",
        //     file: {
        //         name: req.file.originalname,
        //         url: fileUrl,
        //     },
        // });

        res.status(200).json(createdEvent);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : ERROR_MESSAGE.UNKNOWN_ERROR
        res.status(400).json({ message: errorMessage });
    }
})

router.post('/image', upload.single("image"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        const fileUrl = `/uploads/${req.file.filename}`;

        res.status(200).json({ fileUrl });
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