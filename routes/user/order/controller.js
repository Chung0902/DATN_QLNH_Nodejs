const { Order, Customer, Employee, Product, Table, Cart} = require("../../../models");
const { asyncForEach } = require("../../../utils");

module.exports = {
  getAll: async (req, res, next) => {
    try {
      let results = await Order.find()
        .populate("orderDetails.productId")
        .sort({ createdDate: -1 });

      return res.send({ code: 200, payload: results });
    } catch (err) {
      return res.status(500).json({ code: 500, error: err });
    }
  },

  getDetail: async (req, res, next) => {
    try {
      const { id } = req.params;

      let found = await Order.findById(id);

      if (found) {
        return res.send({ code: 200, payload: found });
      }

      return res.status(410).send({ code: 404, message: "Không tìm thấy" });
    } catch (err) {
      res.status(404).json({
        message: "Get detail fail!!",
        payload: err,
      });
    }
  },

  create: async function (req, res, next) {
    try {
      const data = req.body;
      const { customerId, employeeId, orderDetails, tableId } = data;

      const [customer, employee, table] = await Promise.all([
        Customer.findById(customerId),
        Employee.findById(employeeId),
        Table.findById(tableId),
      ]);

      const errors = [];
      if (!customer || customer.isDelete)
        errors.push("Khách hàng không tồn tại hoặc đã bị xóa");
      // if (!employee || employee.isDelete)
      //   errors.push("Nhân viên không tồn tại hoặc đã bị xóa");

      await asyncForEach(orderDetails, async (item) => {
        const product = await Product.findById(item.productId);
        if (!product)
          errors.push(`Sản phẩm ${item.productId} không có trong hệ thống`);
        else {
          if (item.quantity > product.stock) {
            // Kiểm tra số lượng tồn kho đủ để mua không
            errors.push(`Không đủ hàng cho sản phẩm ${product.name}`);
          } else {
            // Trừ số lượng sản phẩm từ kho
            product.stock -= item.quantity;
            await product.save();
          }
        }
      });

      if (errors.length > 0) {
        return res.status(400).json({
          code: 400,
          message: "Lỗi",
          errors,
        });
      }

      // Kiểm tra xem đối tượng Table có tồn tại hay không
      if (!table) {
        return res.status(404).json({
          code: 404,
          message: "Bàn không tồn tại",
        });
      }

      // Cập nhật trạng thái và setup của table
      table.status = "Đã đặt";
      table.setup = "Không có sẵn";
      await table.save();

      const newItem = new Order(data);
      let result = await newItem.save();

      // Xóa các sản phẩm đã được đặt thành công khỏi giỏ hàng
    for (const orderDetail of orderDetails) {
      const productId = orderDetail.productId;

      // Tìm kiếm và xóa sản phẩm từ giỏ hàng dựa trên productId
      await Cart.updateOne(
        { 'products.productId': productId },
        { $pull: { products: { productId: productId } } }
      );
    }

      return res.send({
        code: 200,
        message: "Tạo đơn hàng thành công",
        payload: result,
      });
    } catch (err) {
      return res.status(500).json({ code: 500, error: err });
    }
  },

  remove: async function (req, res, next) {
    try {
      const { id } = req.params;

      let found = await Order.findByIdAndDelete(id);

      if (found) {
        return res.send({
          code: 200,
          payload: found,
          message: "Xóa thành công",
        });
      }

      return res.status(410).send({ code: 404, message: "Không tìm thấy" });
    } catch (err) {
      return res.status(500).json({ code: 500, error: err });
    }
  },

  update: async function (req, res, next) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      /* const { customerId, employeeId, orderDetails } = updateData;

      const getCustomer = Customer.findById(customerId);
      const getEmployee = Employee.findById(employeeId);

      const [customer, employee] = await Promise.all([
        getCustomer,
        getEmployee,
      ]);

      const errors = [];
      if (!customer || customer.isDelete)
        errors.push('Khách hàng không tồn tại');
      if (!employee || employee.isDelete)
        errors.push('Nhân viên không tồn tại');

      await asyncForEach(orderDetails, async (item) => {
        const product = await Product.findById(item.productId);

        if (!product)
          errors.push(`Sản phẩm ${item.productId} không có trong hệ thống`);
      });

      if (errors.length > 0) {
        return res.status(404).json({
          code: 404,
          message: 'Lỗi',
          errors,
        });
      } */

      const found = await Order.findByIdAndUpdate(id, updateData, {
        new: true,
      });

      if (found) {
        return res.send({
          code: 200,
          message: "Cập nhật thành công",
          payload: found,
        });
      }

      return res.status(404).send({ code: 404, message: "Không tìm thấy" });
    } catch (error) {
      return res.status(500).json({ code: 500, error: err });
    }
  },

  payment: async function (req, res, next) {
    return res.status(200).json({
      status: "oke",
      data: process.env.CLIENT_ID,
    });
  },
};
