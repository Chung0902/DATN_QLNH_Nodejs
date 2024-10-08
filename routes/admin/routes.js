var express = require('express');
const router = express.Router();

const passport = require('passport');

const {
  passportConfigAdmin,
  passportConfigLocalAdmin,
} = require('../../middle-wares/passportAdmin');

passport.use('jwtAdmin', passportConfigAdmin);
passport.use('localAdmin', passportConfigLocalAdmin);

const categoriesRouter = require('./category/router');
const customersRouter = require('./customer/router');
const employeesRouter = require('./employee/router');
const ordersRouter = require('./order/router');
const productsRouter = require('./product/router');
const suppliersRouter = require('./supplier/router');
const tablesRouter = require('./table/router');
const reviewsRouter = require('./review/router');


router.use('/employees', employeesRouter);
router.use('/categories', passport.authenticate('jwtAdmin', { session: false }), categoriesRouter);
router.use('/suppliers', suppliersRouter);
router.use('/customers', passport.authenticate('jwtAdmin', { session: false }), customersRouter);
router.use('/products', productsRouter);
router.use('/orders', passport.authenticate('jwtAdmin', { session: false }), ordersRouter);
router.use('/tables', passport.authenticate('jwtAdmin', { session: false }), tablesRouter);
router.use('/reviews', passport.authenticate('jwtAdmin', { session: false }), reviewsRouter);

module.exports = router;
