const yup = require('yup');
const ObjectId = require('mongodb').ObjectId;

module.exports = {
  getDetailSchema: yup.object({
    params: yup.object({
      id: yup.string().test('validationID', 'ID sai định dạng', (value) => {
        return ObjectId.isValid(value);
      }),
    }),
  }),

  createSchema: yup.object({
    body: yup.object({
      rating: yup.number().required().min(1, 'Đánh giá phải từ 1 đến 5').max(5, 'Đánh giá phải từ 1 đến 5'),
      comment: yup.string().required('Bình luận là bắt buộc').max(500, 'Bình luận không được vượt quá 500 ký tự'),
      customerId: yup.string().required('ID khách hàng là bắt buộc').test('validationID', 'ID khách hàng sai định dạng', (value) => {
        return ObjectId.isValid(value);
      }),
      productId: yup.string().required('ID sản phẩm là bắt buộc').test('validationID', 'ID sản phẩm sai định dạng', (value) => {
        return ObjectId.isValid(value);
      }),
    }),
  }),

  updateSchema: yup.object({
    body: yup.object({
      rating: yup.number().min(1, 'Đánh giá phải từ 1 đến 5').max(5, 'Đánh giá phải từ 1 đến 5'),
      comment: yup.string().max(500, 'Bình luận không được vượt quá 500 ký tự'),
    }),
    params: yup.object({
      id: yup.string().test('validationID', 'ID sai định dạng', (value) => {
        return ObjectId.isValid(value);
      }),
    }),
  }),
};
