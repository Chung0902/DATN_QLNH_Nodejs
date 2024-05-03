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
      createdDate: yup.date(),

      shippedDate: yup
        .date()
        .test('check date', '${path} ngày tháng không hợp lệ', function(value) {
          if (!value) return true;

          if (value && this.parent.createdDate && value < this.parent.createdDate) {
            return false;
          }

          if (value < new Date()) {
            return false;
          }

          return true;
        }),

      paymentType: yup.string()
        .default('CASH')
        .oneOf(['CASH', 'CREDIT CARD'], 'Phương thức thanh toán không hợp lệ'),

      status: yup.string()
        .default('WAITING')
        .oneOf(['WAITING', 'COMPLETED', 'CANCELED', 'DELIVERING'], 'Trạng thái không hợp lệ'),

      customerId: yup
        .string()
        .test('validationCustomerID', 'ID khách hàng sai định dạng', (value) => {
          return ObjectId.isValid(value);
        }),

      employeeId: yup
        .string()
        .test('validationEmployeeID', 'ID nhân viên sai định dạng', (value) => {
          return ObjectId.isValid(value);
        }),


      tableId: yup
        .string()
        .test('validationTableID', 'ID bàn sai định dạng', (value) => {
          return ObjectId.isValid(value);
        }),

      orderDetails: yup.array().of(
        yup.object().shape({
          productId: yup
            .string()
            .test('validationProductID', 'ID sản phẩm sai định dạng', (value) => {
              return ObjectId.isValid(value);
            }),

          quantity: yup.number().required().min(0),

          price: yup.number().required().min(0),

          discount: yup.number().min(0),
        }),
      ),
    }),
  }),

  updateOrderSchema: yup.object({
    body: yup.object({
      orderDetails: yup
        .array()
        .of(
          yup.object().shape({
            productId: yup
              .string()
              .test('validationProductID', 'ID sản phẩm sai định dạng', (value) => {
                return ObjectId.isValid(value);
              }),
  
            quantity: yup.number().required().min(0),
  
            price: yup.number().required().min(0),
  
            discount: yup.number().min(0),
          }),
        )
        .required()
        .min(1),
    }),
  }),
};
