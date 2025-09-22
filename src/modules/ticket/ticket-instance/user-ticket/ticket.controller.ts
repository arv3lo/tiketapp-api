import { Router } from "express";

const router = Router()

// TODO: no POST here, tickets will be created via ticket-category

// get tickets by eventID, userID, status, dates, etc.
router.get('/', async (req, res) => {
    // ...
})

router.get('/:id', async (req, res) => {
    // ...
})
// payments, cancellation, transfer user2user
router.put('/:id', async (req, res) => {
    // ...
})

export default router;

