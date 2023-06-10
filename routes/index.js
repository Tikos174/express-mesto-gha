const router = require('express').Router();
const userRouter = require('./users');
const cardsRoutes = require('./cards');

router.use('/users', userRouter);

router.use('/cards', cardsRoutes);

router.use((req, res) => {
  res.status(404).send({ message: 'Неправильный адрес' });
});

module.exports = router;
