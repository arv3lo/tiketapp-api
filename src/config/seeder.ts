import { Router } from "express";
import _ from "lodash"
import { faker } from "@faker-js/faker";

import { UserService } from "@user/user.service";
import { MongooseUserRepo } from "@user/adapters/mongoose.user-repo";
import User from "@user/ports/user.schema";

import { EventService } from "@event/event.service";
import { MongooseEventRepo } from "@event/adapters/mongoose.event-repo";
import Event from "@event/ports/event.schema";
import { EVENT_STATUS, EVENT_TYPE } from "@/common/enums";

const router = Router()
const userService = new UserService(new MongooseUserRepo(User));
const eventService = new EventService(new MongooseEventRepo(Event));

const createUsers = async (count: number) => {
    await User.deleteMany()
    const users = Array.from({ length: count }, () => ({
        fullname: faker.person.fullName(),
        email: faker.internet.email({
            provider: "tiketapp.mg",
            allowSpecialCharacters: false
        }).toLowerCase(),
        password: "pizzapizza" // faker.internet.password({ length: 20, memorable: true }),
    }))

    return await userService.bulkCreateUsers(users)
}

const createEvents = async (count: number) => {
    await Event.deleteMany()
    const organizers = await createUsers(count);

    if (!organizers) return null;
    const events = Array.from({ length: count }, (val, idx) => ({
        name: faker.lorem.word(),
        description: faker.lorem.sentence(),
        location: faker.location.city(),
        date: faker.date.anytime(),
        organizers: organizers[idx]._id.toString(),
        status: EVENT_STATUS.DRAFT,
        type: EVENT_TYPE.CONCERT
    }))

    return await eventService.bulkCreateEvents(events)
}

router.get('/', async (req, res) => {
    await createUsers(5)
    await createEvents(5)
    res.json({ msg: "Seed complete ...." })
})

export default router