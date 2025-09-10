import { Router } from "express";

import { UserService } from "./user.service";
import { MongooseUserRepo } from "./adapters/mongoose.user-repo";
import User from "./ports/user.schema";
import { faker } from "@faker-js/faker";
import _ from "lodash"

const userService = new UserService(new MongooseUserRepo(User));

const router = Router();

router.get('/', async (req, res) => {
    // const users = await userService.findUsers();
    // if (!users) {
    //     return res.status(404).json({ message: 'Users not found' });
    // }
    // res.json(users);

    const newOne = new User(_.pick({
            fullname: faker.person.fullName(),
            email: faker.internet.email({ provider: "tiketapp.mg" }),
            password: faker.internet.password({ length: 20, memorable: true }),
        }, ['fullname', 'email', 'password']))
        
    await newOne.save()
    res.json(newOne)
});

router.get('/:id', async (req, res) => {
    const user = await userService.findUserById(req.params.id);
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
});

router.post('/', async (req, res) => {
    const user = req.body;
    const createdUser = await userService.createUser(user);
    if (!createdUser) {
        return res.status(404).json({ message: 'User not created' });
    }
    res.json(createdUser);
});

router.put('/:id', async (req, res) => {
    const user = req.body;
    const updatedUser = await userService.updateUser(req.params.id, user);
    if (!updatedUser) {
        return res.status(404).json({ message: 'User not updated' });
    }
    res.json(updatedUser);
});

router.delete('/:id', async (req, res) => {
    const deletedUser = await userService.deleteUser(req.params.id);
    if (!deletedUser) {
        return res.status(404).json({ message: 'User not deleted' });
    }
    res.json({ message: 'User deleted' });
});

export default router;