import { Router } from "express";

import { loginUser } from "@auth/ports/use-cases/login-user";
import { registerUser } from "@auth/ports/use-cases/register-user";
import { ERROR_MESSAGE } from "@/common/enums";
import { validateLoginInput, validateRegisterInput } from "@auth/ports/auth.port";

const router = Router()

router.get('/me', (req, res) => {
    res.json({ msg: 'Auth' })
})

router.post('/login', async (req, res) => {
    try {
        const loginInput = validateLoginInput(req.body);
        const { token } = await loginUser(loginInput);
        res.status(200).json({ token });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : ERROR_MESSAGE.UNKNOWN_ERROR
        res.status(400).json({ message: errorMessage });
    }
})

router.post('/register', async (req, res) => {
    try {
        const registerInput = validateRegisterInput(req.body);
        const user = await registerUser(registerInput);
        res.status(200).json({ user });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : ERROR_MESSAGE.UNKNOWN_ERROR
        res.status(400).json({ message: errorMessage });
    }
})

router.get('/logout', (req, res) => {
    res.json({ msg: 'Auth' })
})

export default router;