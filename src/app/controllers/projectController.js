const express = require('express');
const authMiddleware = require('../middlewares/auth');

const router = express.Router();

router.use(authMiddleware);

router.get('/', (req, res) => {
    res.send("Bem vindo a API")
    res.send({ ok: true });
    
});

module.exports = app => app.use('/projects', router);