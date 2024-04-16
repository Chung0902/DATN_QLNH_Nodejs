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
      name: yup.string().required().max(50, 'Tên danh mục không được vượt quá 50 ký tự'),
      description: yup.string().max(500, 'Mô tả không được vượt quá 500 ký tự'),
    }),
  }),
};