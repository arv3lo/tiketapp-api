import { Router } from "express";

const router = Router()

// get tickets by eventID, userID, status, dates, etc.
router.get('/', async (req, res) => {
    // ...
})

router.get('/:id', async (req, res) => {
    // ...
})

router.post('/', async (req, res) => {
    // first, check ticket availability via ticket-category.service
    // if available, create ticket
    // if not available, return error
})

// payments, cancellation, transfer user2user
router.put('/:id', async (req, res) => {
    // ...
})

export default router;

