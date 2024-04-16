const express = require('express');
const router = express.Router();

const { validateSchema } = require('../../../utils');
const {
  getProductSchema,
  createProductSchema,
} = require('./validations');
const {
  getProductAll,
  getProductDetail,
  createProduct,
  deleteProduct,
  updateProduct,
  updateIsDelete,
  productSearch,
} = require('./controller');

router.route('/')
  .get(getProductAll)
  .post(validateSchema(createProductSchema), createProduct)

router.route('/:id')
  .get(validateSchema(getProductSchema), getProductDetail)
  .patch(validateSchema(createProductSchema), updateProduct)
  .delete(validateSchema(getProductSchema), deleteProduct)
router.route('/delete').post(updateIsDelete)
router.route('/productSearch').get(productSearch);


module.exports = router;
