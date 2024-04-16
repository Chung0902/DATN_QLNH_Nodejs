const yup = require("yup");
const { ObjectId } = require("mongodb");

module.exports = {
  getTableSchema: yup.object({
    params: yup.object({
      id: yup.string().test("validationID", "ID sai định dạng", (value) => {
        return ObjectId.isValid(value);
      }),
    }),
  }),
  tableSchema: yup.object({
    body: yup.object({
      name: yup
        .string()
        .required("Tên bàn không được bỏ trống")
        .max(100, "Tên bàn không được vượt quá 100 ký tự")
        .trim()
        .strict(),
      numberOfSeats: yup
        .number()
        .required("Số ghế không được bỏ trống")
        .min(1, "Số ghế tối thiểu là 1"),
      setup: yup
        .string()
        .max(500, "Mô tả không được vượt quá 500 ký tự")
        .trim()
        .strict(),
      status: yup
        .string()
        .oneOf(["Đang trống", "Đã đặt"], "Trạng thái không hợp lệ")
        .default("empty"),
      isDelete: yup.boolean().required("Trường isDelete là bắt buộc"),
    }),
  }),
};
