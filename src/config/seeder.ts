import { Router } from "express";
import _ from "lodash"
import { faker } from "@faker-js/faker";

import { EVENT_STATUS, EVENT_TYPE, USER_ROLE } from "@/common/enums";
import { UserService } from "@user/user.service";
import { MongooseUserRepo } from "@user/adapters/mongoose.user-repo";
import User from "@user/ports/user.schema";
import { EventService } from "@event/event.service";
import { MongooseEventRepo } from "@event/adapters/mongoose.event-repo";
import Event from "@event/ports/event.schema";
import Category from "@category/ports/category.schema";
import TicketSetup from "@setup/ports/setup.schema";

const router = Router()
const userService = new UserService(new MongooseUserRepo(User));
const eventService = new EventService(new MongooseEventRepo(Event));

// TODO: create users with different roles
const createUsers = async (count: number, role?: string) => {
    const users = Array.from({ length: count }, () => ({
        fullname: faker.person.fullName(),
        email: faker.internet.email({
            provider: "tiketapp.mg",
            allowSpecialCharacters: false
        }).toLowerCase(),
        role: role || USER_ROLE.ORGANIZER,
        password: "pizzapizza" // faker.internet.password({ length: 20, memorable: true }),
    }))

    return await userService.bulkCreateUsers(users)
}

// TODO: create events with different types, organizers, sponsors, artists
const createEvents = async (count: number) => {
    const organizers = await userService.findUsers({ role: USER_ROLE.ORGANIZER });
    const artists = await userService.findUsers({ role: USER_ROLE.ARTIST });

    if (!organizers || !artists) return null;
    const events = Array.from({ length: count }, (val, idx) => ({
        name: faker.lorem.word(),
        description: faker.lorem.sentence(),
        location: faker.location.city(),
        date: faker.date.anytime(),
        organizers: organizers.map((user) => user._id.toString()),
        artists: artists.map((user) => user._id.toString()),
        status: EVENT_STATUS.DRAFT,
        type: EVENT_TYPE.CONCERT
    }))

    return await eventService.bulkCreateEvents(events)
}

const createTicketSetupCategory = async (names: string[]) => {
    names.forEach(async (name) => {
        await Category.create({
            name,
            description: faker.lorem.sentence(),
        })
    })
}

const createTicketSetup = async () => {
    const organizers = await userService.findUsers({ role: USER_ROLE.ORGANIZER });
    const ticketCategories = await Category.find()

    organizers.forEach(async (organizer) => {
        await TicketSetup.create({
            name: faker.lorem.word(),
            description: faker.lorem.sentence(),
            organizer: organizer._id.toString(),
            categories: ticketCategories,
        })
    })
}

const resetAll = async () => {
    await User.deleteMany()
    await Event.deleteMany()
    await Category.deleteMany()
    await TicketSetup.deleteMany()
}

router.get('/', async (req, res) => {
    await resetAll()

    await createUsers(10, USER_ROLE.ARTIST);
    await createUsers(5, USER_ROLE.ORGANIZER);

    await createEvents(5)
    await createTicketSetupCategory(["General", "VIP", "Backstage", "FanZone"])
    await createTicketSetup()

    res.json({ msg: "Seed complete ...." })
})

export default router