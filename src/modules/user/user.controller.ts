import { Router } from "express";
import _ from "lodash"

import { isValidID } from "@/middlewares";
import { UserService } from "@user/user.service";
import { MongooseUserRepo } from "@user/adapters/mongodb/user-repo";
import User from "@user/adapters/mongodb/user.schema";
import { validateUserInput } from "@user/ports/user.port";

const router = Router();
const userService = new UserService(new MongooseUserRepo(User));

const filters = ["fullname", "email", "role"];
const inputFields = [...filters, "createdAt", "updatedAt", "_id", "isDeleted"];

// TODO: dynamic error messages
// we used pick to remove password here because omit is a bit slower 
// and we met some issues using it
router.get('/', async (req, res) => {
    const users = await userService.findUsers(req.query);
    if (!users || users.length === 0) return res.status(404).json({ message: 'Users not found' });
    res.json(users.map(user => _.pick(user, inputFields)));
});

router.get('/:id', isValidID, async (req, res) => {
    const user = await userService.findUserById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(_.pick(user, inputFields));
});

router.post('/', async (req, res) => {
    // TODO: try catch the following method, it returns 500 when an error occurs
    const userInput = validateUserInput(req.body);
    const createdUser = await userService.createUser(userInput);
    if (!createdUser) return res.status(404).json({ message: 'User not created' });

    res.json(_.pick(createdUser, inputFields));
});

router.put('/:id', isValidID, async (req, res) => {
    const userInput = validateUserInput(req.body);
    const updatedUser = await userService.updateUser(req.params.id, userInput);
    if (!updatedUser) return res.status(404).json({ message: 'User not updated' });

    res.json(_.pick(updatedUser, inputFields));
});

router.delete('/:id', isValidID, async (req, res) => {
    const deletedUser = await userService.deleteUser(req.params.id);
    if (!deletedUser) return res.status(404).json({ message: 'User not deleted' });

    res.json(_.pick(deletedUser, inputFields));
});

export default router;