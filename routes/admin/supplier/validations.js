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
      name: yup.string().required().max(100, 'Tên nhà cung cấp không được vượt quá 100 ký tự'),

      email: yup.string()
        .required()
        // .email()
        .test('email type', '${path} Không phải email hợp lệ', (value) => {
          const emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;

          return emailRegex.test(value);
        }),

      phoneNumber: yup.string()
        .required()
        .test('phoneNumber type', '${path} Không phải số điện thoại hợp lệ', (value) => {
          const phoneRegex = /^(0?)(3[2-9]|5[6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])[0-9]{7}$/;

          return phoneRegex.test(value);
        }),

      address: yup.string().max(500, 'Địa chỉ không được vượt quá 500 ký tự'),
    }),
  }),
};