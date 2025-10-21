import { Router } from "express";
import _ from "lodash"
import { faker } from "@faker-js/faker";

import { EVENT_STATUS, EVENT_TYPE, USER_ROLE } from "@/common/enums";
import { UserService } from "@/modules/user/ports/user.service";
import { MongooseUserRepo } from "@user/adapters/mongodb/user-repo";
import type { TUserInput } from "@user/ports/user.port";
import User from "@user/adapters/mongodb/user.schema";
import { EventService } from "@/modules/event/ports/event.service";
import { MongooseEventRepo } from "@event/adapters/mongodb/event-repo";
import Event from "@event/adapters/mongodb/event.schema";
import Category from "@category/adapters/mongodb/category.schema";
import TicketSetup from "@setup/adapters/mongodb/setup.schema";

import TicketCategory from "@user-ticket-category/adapters/mongodb/ticket-category.schema";

const router = Router()
const userService = new UserService(new MongooseUserRepo(User));
const eventService = new EventService(new MongooseEventRepo(Event));

export const generateUsers = (count: number, role?: USER_ROLE): TUserInput[] => {
    return Array.from({ length: count }, () => ({
        fullname: faker.person.fullName(),
        email: faker.internet.email({
            provider: "tiketapp.mg",
            allowSpecialCharacters: false
        }).toLowerCase(),
        role: (role || USER_ROLE.ORGANIZER) as USER_ROLE,
        password: "pizzapizza" // faker.internet.password({ length: 20, memorable: true }),
    }))
}

// TODO: create users with different roles
const createUsers = async (count: number, role?: USER_ROLE) => {
    const users = generateUsers(count, role)
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
        startDate: faker.date.soon({ days: 7 }),
        organizers: organizers.map((user) => user._id),
        artists: artists.map((user) => user._id),
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
            organizer: organizer._id,
            categories: ticketCategories,
        })
    })
}

const createAvailableTickets = async () => {
    const ticketCategories = await Category.find()
    const events = await Event.find()

    ticketCategories.forEach(async (ticketCategory) => {
        events.forEach(async (event) => {
            await TicketCategory.create({
                name: ticketCategory.name,
                description: ticketCategory.description,
                event: event._id,
                price: 3000,
                availableAmount: 250,
            })
        })
    })
}

const resetAll = async () => {
    await User.deleteMany()
    await Event.deleteMany()
    await Category.deleteMany()
    await TicketSetup.deleteMany()
    await TicketCategory.deleteMany()
}

router.get('/', async (req, res) => {
    await resetAll()

    await createUsers(5, USER_ROLE.ATTENDEE);
    await createUsers(3, USER_ROLE.ARTIST);
    await createUsers(2, USER_ROLE.ORGANIZER);

    await createEvents(2)
    await createTicketSetupCategory(["General", "VIP", "Backstage", "FanZone"])
    await createTicketSetup()

    await createAvailableTickets()

    res.json({ msg: "Seed complete ...." })
})

export default router