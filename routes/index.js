const router = require('express').Router();
const userRouter = require('./users');
const cardsRoutes = require('./cards');

router.use('/users', userRouter);

router.use('/cards', cardsRoutes);

module.exports = router;
