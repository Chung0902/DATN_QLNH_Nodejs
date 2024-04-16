const yup = require('yup');
const ObjectId = require('mongodb').ObjectId;

module.exports = {
  getTableSchema: yup.object({
    params: yup.object({
      id: yup.string().test('validationID', 'ID sai định dạng', (value) => {
        return ObjectId.isValid(value);
      }),
    }),
  }),

  tableSchema: yup.object().shape({
    name: yup.string()
      .required('Tên bàn không được bỏ trống')
      .max(100, 'Tên bàn không được vượt quá 100 ký tự')
      .trim()
      .strict(),

    numberOfSeats: yup.number()
      .required('Số ghế không được bỏ trống')
      .min(1, 'Số ghế tối thiểu là 1'),

    setup: yup.string()
      .max(500, 'Mô tả không được vượt quá 500 ký tự')
      .trim()
      .strict(),

    status: yup.string()
      .oneOf(['empty', 'already_booked'], 'Trạng thái không hợp lệ')
      .default('empty'),

    isDelete: yup.boolean().required(),
  }),

  idSchema: yup.object().shape({
    id: yup.string().trim().strict().required('ID không được bỏ trống'),
  }),
};
