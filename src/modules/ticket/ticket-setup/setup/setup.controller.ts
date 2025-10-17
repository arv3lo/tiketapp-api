import { Router } from "express"
import _ from "lodash"

import { SetupService } from "@setup/setup.service"
import { MongooseTicketSetupRepo } from "@setup/adapters/mongodb/setup-repo"
import TicketSetup from "@setup/adapters/mongodb/setup.schema"
import { validateTicketSetupInput } from "@setup/ports/setup.port"
import { ERROR_MESSAGE } from "@/common/enums"

const router = Router()
const setupService = new SetupService(new MongooseTicketSetupRepo(TicketSetup))

const inputFields = ['name', 'description', 'organizer', 'categories', '_id']

router.get('/:organizerID', async (req, res) => {
    const setup = await setupService.findTicketSetupByOrganizerId(req.params.organizerID)
    if (!setup) return res.status(404).json({ message: ERROR_MESSAGE.NOT_FOUND })

    res.status(200).json(_.pick(setup, inputFields))
})

router.post('/', async (req, res) => {
    try {
        const ticketSetupInput = validateTicketSetupInput(req.body)
        const setup = await setupService.createTicketSetup(ticketSetupInput)
        if (!setup) return res.status(404).json({ message: ERROR_MESSAGE.NOT_CREATED })

        res.status(200).json(_.pick(setup, inputFields))
    } catch (error) {
        res.status(400).json({ message: ERROR_MESSAGE.NOT_CREATED })
    }
})

router.put('/:id', async (req, res) => {
    try {
        const ticketSetupInput = validateTicketSetupInput(req.body)
        const setup = await setupService.updateTicketSetup(req.params.id, ticketSetupInput)
        if (!setup) return res.status(404).json({ message: ERROR_MESSAGE.NOT_UPDATED })

        res.status(200).json(_.pick(setup, inputFields))
    } catch (error) {
        res.status(400).json({ message: ERROR_MESSAGE.NOT_UPDATED })
    }
})

router.delete('/:id', async (req, res) => {
    const setup = await setupService.deleteTicketSetup(req.params.id)
    if (!setup) return res.status(404).json({ message: ERROR_MESSAGE.NOT_DELETED })

    res.status(200).json(_.pick(setup, inputFields))
})

export default router
