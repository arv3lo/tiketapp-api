import { Router } from "express";
import _ from "lodash"
import { faker } from "@faker-js/faker";

import { UserService } from "@/modules/user/user.service";
import { MongooseUserRepo } from "@/modules/user/adapters/mongoose.user-repo";
import User from "@/modules/user/ports/user.schema";

const router = Router()
const userService = new UserService(new MongooseUserRepo(User));

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

    await userService.bulkCreateUsers(users)
}

router.get('/', async (req, res) => {
    await createUsers(5)
    res.json({ msg: "Seed complete ...." })
})

export default router