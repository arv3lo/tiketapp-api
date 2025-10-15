import { Router } from "express"
import _ from "lodash"

import { SetupService } from "@setup/setup.service"
import { MongooseTicketSetupRepo } from "@setup/adapters/mongodb/setup-repo"
import TicketSetup, { validateTicketSetupInput } from "@setup/adapters/mongodb/setup.schema"

const router = Router()
const setupService = new SetupService(new MongooseTicketSetupRepo(TicketSetup))

const inputFields = ['name', 'description', 'organizer', 'categories', '_id']

router.get('/:organizerID', async (req, res) => {
    const setup = await setupService.findTicketSetupByOrganizerId(req.params.organizerID)
    if (!setup) return res.status(404).json({ message: 'Setup not found' })

    res.json(_.pick(setup, inputFields))
})

router.post('/', async (req, res) => {
    const setup = await setupService.createTicketSetup(validateTicketSetupInput(req.body))
    if (!setup) return res.status(404).json({ message: 'Setup not created' })

    res.json(_.pick(setup, inputFields))
})

router.put('/:id', async (req, res) => {
    const setup = await setupService.updateTicketSetup(req.params.id, validateTicketSetupInput(req.body))
    if (!setup) return res.status(404).json({ message: 'Setup not updated' })

    res.json(_.pick(setup, inputFields))
})

router.delete('/:id', async (req, res) => {
    const setup = await setupService.deleteTicketSetup(req.params.id)
    if (!setup) return res.status(404).json({ message: 'Setup not deleted' })

    res.json(_.pick(setup, inputFields))
})

export default router
