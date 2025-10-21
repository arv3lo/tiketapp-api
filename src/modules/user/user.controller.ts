import { Router } from "express";
import _ from "lodash"

import { isValidID } from "@/middlewares";
import { ERROR_MESSAGE } from "@/common/enums";
import { validateUserInput } from "@user/ports/user.port";
import { getUsers, getUser } from "@user/ports/use-cases/get-users";
import { createUser } from "@user/ports/use-cases/create-user";
import { deleteUser, updateUser } from "@user/ports/use-cases/update-user";

const router = Router();

router.get('/', async (req, res) => {
    try {
        const users = await getUsers(req.query);
        
        res.status(200).json(users);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : ERROR_MESSAGE.UNKNOWN_ERROR
        res.status(400).json({ message: errorMessage });
    }
});

router.get('/:id', isValidID, async (req, res) => {
    try {
        const user = await getUser(req.params.id);

        res.status(200).json(user);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : ERROR_MESSAGE.UNKNOWN_ERROR
        res.status(400).json({ message: errorMessage });
    }
});

router.post('/', async (req, res) => {
    try {
        const userInput = validateUserInput(req.body);
        const createdUser = await createUser(userInput);

        res.status(200).json(createdUser);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : ERROR_MESSAGE.UNKNOWN_ERROR
        res.status(400).json({ message: errorMessage });
    }
});

router.put('/:id', isValidID, async (req, res) => {
    try {
        const userInput = validateUserInput(req.body);
        const updatedUser = await updateUser(req.params.id, userInput);

        res.status(200).json(updatedUser);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : ERROR_MESSAGE.UNKNOWN_ERROR
        res.status(400).json({ message: errorMessage });
    }
});

router.delete('/:id', isValidID, async (req, res) => {
    try {
        const deletedUser = await deleteUser(req.params.id);

        res.status(200).json(deletedUser);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : ERROR_MESSAGE.UNKNOWN_ERROR
        res.status(400).json({ message: errorMessage });
    }
});

export default router;