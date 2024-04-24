const express = require('express');
const router = express.Router();

const { validateSchema } = require('../../../utils');
const {
  getDetailSchema,
  createSchema,
  updateOrderSchema
} = require('./validations');
const {
  getAll,
  getDetail,
  create,
  remove,
  updateOrderDetails,
  updateIsDelete,
} = require('./controller');

router.route('/')
  .get(getAll)
  .post(validateSchema(createSchema), create)

router.route('/:id')
  .get(validateSchema(getDetailSchema), getDetail)
  .patch(validateSchema(updateOrderSchema), updateOrderDetails)
  .delete(validateSchema(getDetailSchema), remove)
router.route('/delete').post(updateIsDelete) 
module.exports = router;
