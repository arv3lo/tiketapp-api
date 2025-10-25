import { type Express } from 'express'
import bodyParser from 'body-parser'
// import pinoHttp from 'pino-http'

import userController from "@user/user.controller"
import authController from "@auth/auth.controller"
import eventController from '@event/event.controller'
import ticketSetupController from '@setup/setup.controller'
import ticketSetupCategoryController from '@category/category.controller'
import userTicketController from '@user-ticket/ticket.controller'
import userTicketCategoryController from '@user-ticket-category/ticket-category.controller'
import followController from '@follow/follow.controller'
import { authentication, globalError } from '@/middlewares'
import seeder from './seeder'

// TODO: just add [authentication] to every route that needs to be protected
// and have access to the current user
export const routes = (app: Express) => {
    // app.use(pinoHttp())
    app.use(bodyParser.json({ limit: '50mb' }))
    app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }))

    app.use('/auth', authController)
    app.use('/users', [authentication], userController)
    app.use('/events', eventController)
    app.use('/ticket-setup', ticketSetupController)
    app.use('/ticket-setup-category', ticketSetupCategoryController)
    app.use('/user-ticket', userTicketController)
    app.use('/user-ticket-category', userTicketCategoryController)
    app.use('/follow', followController)
    app.use('/seed', seeder)

    app.use(globalError)
}
