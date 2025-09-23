import { type Express } from 'express'
import bodyParser from 'body-parser'

import userController from "@user/user.controller"
import authController from "@auth/auth.controller"
import eventController from '@event/event.controller'
import ticketSetupController from '@setup/setup.controller'
import { authentication, globalError } from '@/middlewares'
import seeder from './seeder'

export const routes = (app: Express) => {
    app.use(bodyParser.json({ limit: '50mb' }))
    app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }))

    app.use('/auth', authController)
    app.use('/users', userController)
    app.use('/events', eventController)
    app.use('/ticket-setup', ticketSetupController)
    app.use('/seed', seeder)

    app.use(globalError)
}
