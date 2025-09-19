import { Router } from "express";
import _ from "lodash"

import { isValidID } from "@/middlewares";
import { UserService } from "@user/user.service";
import { MongooseUserRepo } from "@user/adapters/mongoose.user-repo";
import User, { validateUser } from "@user/ports/user.schema";

const router = Router();
const userService = new UserService(new MongooseUserRepo(User));

const filters = ["fullname", "email", "role"];
const inputFields = [...filters, "createdAt", "updatedAt", "_id"];

// TODO: dynamic error messages
// we used pick to remove password here because omit is a bit slower 
// and we met some issues using it
router.get('/', async (req, res) => {
    const users = await userService.findUsers(_.pick(req.query, filters));
    if (!users) return res.status(404).json({ message: 'Users not found' });
    res.json(users.map(user => _.pick(user, inputFields)));
});

router.get('/:id', isValidID, async (req, res) => {
    const user = await userService.findUserById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    res.json(_.pick(user, inputFields));
});

router.post('/', async (req, res) => {
    const user = req.body;
    const createdUser = await userService.createUser(validateUser(user));
    if (!createdUser) return res.status(404).json({ message: 'User not created' });

    res.json(_.pick(createdUser, inputFields));
});

router.put('/:id', isValidID, async (req, res) => {
    const user = req.body;
    const updatedUser = await userService.updateUser(req.params.id, validateUser(user));
    if (!updatedUser) return res.status(404).json({ message: 'User not updated' });

    res.json(_.pick(updatedUser, inputFields));
});

router.delete('/:id', isValidID, async (req, res) => {
    const deletedUser = await userService.deleteUser(req.params.id);
    if (!deletedUser) return res.status(404).json({ message: 'User not deleted' });

    res.json(_.pick(deletedUser, inputFields));
});

export default router;