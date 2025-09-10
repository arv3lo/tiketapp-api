import { type Express } from 'express'
import bodyParser from 'body-parser'

import userController from "@/modules/user/user.controller"
import globalError from '@/middlewares/global-error'
import seeder from './seeder'

export const routes = (app: Express) => {
    app.use(bodyParser.json({ limit: '50mb' }))
    app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }))
    
    app.use('/api/users', userController)
    app.use('/seed', seeder)

    app.use(globalError)
}
