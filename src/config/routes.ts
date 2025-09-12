import { type Express } from 'express'
import bodyParser from 'body-parser'

import authController from "@/modules/auth/auth.controller"
import userController from "@/modules/user/user.controller"
import { authentication, globalError } from '@/middlewares'
import seeder from './seeder'

export const routes = (app: Express) => {
    app.use(bodyParser.json({ limit: '50mb' }))
    app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }))

    app.use('/api/auth', authController)
    app.use('/api/users', [authentication], userController)
    app.use('/seed', seeder)

    app.use(globalError)
}
