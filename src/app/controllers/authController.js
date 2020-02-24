const express = require('express');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authConfig = require('../../config/auth');
const crypto = require('crypto');
const mailer = require('../../modules/mailer');
const path = require('path');

const router = express.Router();

function generateToken(params = {}) {
    return jwt.sign({ params }, authConfig.secret, { expiresIn: 86400, });
}

router.post('/register', async (req, res) => {
    const { email } = req.body;
    try {
        if (await User.findOne({ email }))
            return res.status(400).send({ error: 'User already exists' });


        const user = await User.create(req.body);
        user.password = undefined;

        const token = generateToken({ id: user.id });

        return res.send({ user, token });

    } catch (err) {
        return res.status(400).send({ error: 'Registration failed' });
    }

});

router.post('/authenticate', async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');

    if (!user)
        return res.status(400).send({ error: 'User not found' });

    if (!await bcrypt.compare(password, user.password))
        return res.status(400).send({ error: 'Invalid password' });

    user.password = undefined;

    const token = generateToken({ id: user.id });

    res.send({ user, token });
});

router.post('/forgot_password', async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user)
            return res.status(400).send({ error: 'User not found' });

        const token = crypto.randomBytes(20).toString('hex');

        const now = new Date();
        now.setHours(now.getHours() + 1);

        await User.findByIdAndUpdate(user.id, {
            '$set': {
                passwordResetToken: token,
                passwordResetExpires: now,
            },
        });

        var mailOptions = {
            from: 'test-fcf89d@inbox.mailtrap.io',
            to: email,
            template: 'forgotPassword',
            //subject: 'hello world!',
            //text: 'hello world!',
            context: { token },
        };

        mailer.sendMail(mailOptions, (error) => {
            if (error) {
                console.log('\n\nErroooooorerror', error);
                res.status(400).send({ error: 'Erro on send forgot_password' });
            }

            res.status(200).send("EMail enviado");
        });


    } catch (err) {
        console.log("\n aki", err);
        res.status(400).send({ error: 'Erro on forgot_password' });
    }
});

router.post('/reset_password', async (req, res) => {
    const { email, token, password } = req.body;

    try {
        const user = await User.findOne({email}).select('+passwordResetToken passwordResetExpires');


        if (!user){
            return res.status(400).send({ error: 'User not found' });
        }

        if (token !== user.passwordResetToken){
            return res.status(400).send({ error: 'Token invalid, try with other token!!' });
        }
        
        const now = new Date(); 
        if(now > user.passwordResetExpires)
            return res.status(400).send({ error: 'Token is expired, generate other token!!' });
        
        user.password = password;

        await user.save();

        res.send();


    } catch (err) {
        return res.status(400).send({ error: 'Cannot reset password, try again!!!' });
    }
});

module.exports = app => app.use('/auth', router);