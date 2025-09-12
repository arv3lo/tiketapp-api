import { Router } from "express";
import _ from "lodash"

import { isValidID } from "@/middlewares";
import { UserService } from "@modules/user/user.service";
import { MongooseUserRepo } from "@modules/user/adapters/mongoose.user-repo";
import User from "@modules/user/ports/user.schema";

const userService = new UserService(new MongooseUserRepo(User));
const router = Router();

// TODO: dynamic error messages

router.get('/', async (req, res) => {
    const users = await userService.findUsers();
    // console.log('!req.userId', req.userId)
    // console.log('!req.role', req.role)
    if (!users) return res.status(404).json({ message: 'Users not found' });

    res.json(users);
});

router.get('/:id', isValidID, async (req, res) => {
    const user = await userService.findUserById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user);
});

router.post('/', async (req, res) => {
    const user = req.body;
    const createdUser = await userService.createUser(user);
    if (!createdUser) return res.status(404).json({ message: 'User not created' });

    res.json(createdUser);
});

router.put('/:id', isValidID, async (req, res) => {
    const user = req.body;
    const updatedUser = await userService.updateUser(req.params.id, user);
    if (!updatedUser) return res.status(404).json({ message: 'User not updated' });

    res.json(updatedUser);
});

router.delete('/:id', isValidID, async (req, res) => {
    const deletedUser = await userService.deleteUser(req.params.id);
    if (!deletedUser) return res.status(404).json({ message: 'User not deleted' });

    res.json({ message: 'User deleted' });
});

export default router;