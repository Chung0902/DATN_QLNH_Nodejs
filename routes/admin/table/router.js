const express = require('express');
const router = express.Router();
const { validateSchema } = require('../../../utils');
const { getTableSchema, tableSchema } = require('./validations');
const {
  getTableAll,
  getTableDetail,
  createTable,
  deleteTable,
  updateTable,
} = require('./controller');

router.route('/')
  .get(getTableAll)
  .post(validateSchema(tableSchema), createTable);

router.route('/:id')
  .get(validateSchema(getTableSchema), getTableDetail)
  .patch(validateSchema(tableSchema), updateTable)
  .delete(validateSchema(getTableSchema), deleteTable);

module.exports = router;
