const router = require('express').Router();
const userRouter = require('./users');
// const cardsRoutes = require('./users');

router.use('/users', userRouter);
// router.use(cardsRoutes);

module.exports = router;
