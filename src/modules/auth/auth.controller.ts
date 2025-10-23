import { Router } from "express";

import User from "@user/adapters/mongodb/user.schema";
import { HISTORY_TYPE, HISTORY_OBJECT, ERROR_MESSAGE } from "@/common/enums";

const router = Router()

router.get('/me', (req, res) => {
    res.json({ msg: 'Auth' })
})

router.post('/login', async (req, res) => {
    // TODO: create this login input validation function
    // const { error } = validate(req.body);
    // if(error) return res.status(400).send(error.details[0].message);

    // TODO: use user service to avoid depending on the model and mongoose odm
    const user = await User.findOne({ 'email': req.body.email });
    if (!user) return res.status(400).send(ERROR_MESSAGE.LOGIN_ERROR);

    const validPassword = await Bun.password.verify(req.body.password, user.password || "");
    if (!validPassword) return res.status(400).send(ERROR_MESSAGE.LOGIN_ERROR);

    const token = user.generateAuthToken();
    await user.generateHistory({
        type: HISTORY_TYPE.AUTH_LOGIN,
        description: 'Connexion',
        obj: user._id,
        model: HISTORY_OBJECT.USER
    })


    // await User.updateOne({ 'username': req.body.username }, {
    //     $set: { 'isActive': true }
    // });

    // await user.generateHistorique('connexion');
    res.send({ 'token': token });
})

router.post('/register', (req, res) => {
    res.json({ msg: 'Auth' })
})

router.get('/logout', (req, res) => {
    res.json({ msg: 'Auth' })
})

export default router;