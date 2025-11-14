import { type Express } from 'express'
import bodyParser from 'body-parser'
import helmet from 'helmet'
import compression from 'compression'
// import pinoHttp from 'pino-http'
import { toNodeHandler, fromNodeHeaders } from "better-auth/node";

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
import { auth } from '@/lib/auth'

// TODO: just add [authentication] to every route that needs to be protected
// and have access to the current user
export const routes = (app: Express) => {
    // app.use(pinoHttp())
    app.use(helmet())
    app.use(compression())
    app.use(bodyParser.json({ limit: '2mb' }))
    app.use(bodyParser.urlencoded({ extended: true, limit: '2mb' }))
    
    app.all("/api/auth/*splat", toNodeHandler(auth));
    app.get("/api/me", async (req, res) => {
        const session = await auth.api.getSession({
         headers: fromNodeHeaders(req.headers),
       });
       return res.json(session);
   });

    app.use('/auth',                    authController)
    app.use('/events',                  eventController)
    app.use('/users',                   userController)
    app.use('/ticket-setup',            [authentication],           ticketSetupController)
    app.use('/ticket-setup-category',   [authentication],           ticketSetupCategoryController)
    app.use('/user-ticket',             [authentication],           userTicketController)
    app.use('/user-ticket-category',    [authentication],           userTicketCategoryController)
    app.use('/follow',                  [authentication],           followController)
    app.use('/seed',                    seeder)

    app.use(globalError)
    app.disable('x-powered-by')
}
