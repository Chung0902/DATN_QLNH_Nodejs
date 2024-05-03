const {
  Order,
  Customer,
  Employee,
  Product,
  Table,
} = require("../../../models");
const { asyncForEach } = require("../../../utils");


module.exports = {
  getAll: async (req, res, next) => {
    try {
      let results = await Order.find();
      res.set("Cache-Control", "no-cache, no-store, must-revalidate");
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
      return res.status(404).send({ code: 404, message: "Không tìm thấy" });
    } catch (err) {
      return res.status(500).json({ code: 500, error: err });
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
        if (!employee || employee.isDelete)
            errors.push("Nhân viên không tồn tại hoặc đã bị xóa");

        await asyncForEach(orderDetails, async (item) => {
            const product = await Product.findById(item.productId);
            if (!product)
                errors.push(`Sản phẩm ${item.productId} không có trong hệ thống`);
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
        table.status = 'Đã đặt';
        table.setup = 'Không có sẵn';
        await table.save();

        const newItem = new Order(data);
      let result = await newItem.save();
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
          message: "Xóa đơn hàng thành công",
        });
      }
      return res.status(404).send({ code: 404, message: "Không tìm thấy" });
    } catch (err) {
      return res.status(500).json({ code: 500, error: err });
    }
  },

  update: async function (req, res, next) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const { customerId, employeeId, tableId, newOrderDetails } = updateData;

      const [customer, employee, table] = await Promise.all([
        Customer.findById(customerId),
        Employee.findById(employeeId),
        Table.findById(tableId),
      ]);

      const errors = [];
      if (!customer || customer.isDelete)
        errors.push("Khách hàng không tồn tại hoặc đã bị xóa");
      if (!employee || employee.isDelete)
        errors.push("Nhân viên không tồn tại hoặc đã bị xóa");
      if (!table || table.isDelete)
        errors.push("Bàn ăn không tồn tại hoặc đã bị xóa");

      if (errors.length > 0) {
        return res.status(400).json({
          code: 400,
          message: "Lỗi",
          errors,
        });
      }

      const found = await Order.findByIdAndUpdate(
        id,
        {
          customerId,
          employeeId,
          tableId,
          $push: { orderDetails: { $each: newOrderDetails } }, // Thêm món ăn mới vào orderDetails
        },
        { new: true }
      );

      if (found) {
        return res.send({
          code: 200,
          message: "Cập nhật đơn hàng thành công",
          payload: found,
        });
      }

      return res.status(404).send({ code: 404, message: "Không tìm thấy" });
    } catch (error) {
      return res.status(500).json({ code: 500, error: error });
    }
  },

  // updateOrderDetails: async function (req, res, next) {
  //     try {
  //         const { id } = req.params;
  //         const updateData = req.body;
  //         const { orderDetails } = updateData;

  //         // Kiểm tra xem orderDetails có tồn tại và không rỗng không
  //         if (!orderDetails || !Array.isArray(orderDetails) || orderDetails.length === 0) {
  //             return res.status(400).json({
  //                 code: 400,
  //                 message: "Vui lòng cung cấp thông tin chi tiết đơn hàng"
  //             });
  //         }

  //         // Kiểm tra tính hợp lệ của mỗi sản phẩm trong orderDetails
  //         for (const item of orderDetails) {
  //             const { productId, quantity, price } = item;

  //             // Kiểm tra xem productId, quantity và price có tồn tại không
  //             if (!productId || !quantity || !price) {
  //                 return res.status(400).json({
  //                     code: 400,
  //                     message: "Vui lòng cung cấp đầy đủ thông tin (productId, quantity, price) cho mỗi sản phẩm"
  //                 });
  //             }

  //             // Kiểm tra xem sản phẩm có tồn tại trong hệ thống không
  //             const product = await Product.findById(productId);
  //             if (!product) {
  //                 return res.status(400).json({
  //                     code: 400,
  //                     message: `Sản phẩm ${productId} không có trong hệ thống`
  //                 });
  //             }
  //         }

  //         // Tạo một mảng mới chứa các đối tượng OrderDetail từ orderDetails
  //         const newOrderDetails = orderDetails.map(item => ({
  //             productId: item.productId,
  //             quantity: item.quantity,
  //             price: item.price
  //         }));

  //         // Tìm đơn hàng và cập nhật thông tin chi tiết đơn hàng
  //         const found = await Order.findByIdAndUpdate(id, {
  //             $set: {
  //                 orderDetails: newOrderDetails
  //             }
  //         }, { new: true });

  //         if (found) {
  //             return res.send({
  //                 code: 200,
  //                 message: 'Cập nhật thông tin chi tiết đơn hàng thành công',
  //                 payload: found,
  //             });
  //         }

  //         return res.status(404).send({ code: 404, message: 'Không tìm thấy' });
  //     } catch (error) {
  //         return res.status(500).json({ code: 500, error: error });
  //     }
  // },

  //Thêm mới products trong orderdetail
  updateOrderDetails: async function (req, res, next) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const { orderDetails } = updateData;

      // Kiểm tra xem orderDetails có tồn tại và không rỗng không
      if (
        !orderDetails ||
        !Array.isArray(orderDetails) ||
        orderDetails.length === 0
      ) {
        return res.status(400).json({
          code: 400,
          message: "Vui lòng cung cấp thông tin chi tiết đơn hàng",
        });
      }

      // Kiểm tra tính hợp lệ của mỗi sản phẩm trong orderDetails
      for (const item of orderDetails) {
        const { productId, quantity, price } = item;

        // Kiểm tra xem productId, quantity và price có tồn tại không
        if (!productId || !quantity || !price) {
          return res.status(400).json({
            code: 400,
            message:
              "Vui lòng cung cấp đầy đủ thông tin (productId, quantity, price) cho mỗi sản phẩm",
          });
        }

        // Kiểm tra xem sản phẩm có tồn tại trong hệ thống không
        const product = await Product.findById(productId);
        if (!product) {
          return res.status(400).json({
            code: 400,
            message: `Sản phẩm ${productId} không có trong hệ thống`,
          });
        }
      }

      // Tạo một mảng mới chứa các đối tượng OrderDetail từ orderDetails
      const newOrderDetails = orderDetails.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
      }));

      // Tìm đơn hàng và thêm các sản phẩm mới vào chi tiết đơn hàng
      const found = await Order.findByIdAndUpdate(
        id,
        {
          $addToSet: {
            orderDetails: { $each: newOrderDetails },
          },
        },
        { new: true }
      );

      if (found) {
        return res.send({
          code: 200,
          message: "Thêm sản phẩm vào chi tiết đơn hàng thành công",
          payload: found,
        });
      }

      return res.status(404).send({ code: 404, message: "Không tìm thấy" });
    } catch (error) {
      return res.status(500).json({ code: 500, error: error });
    }
  },

  //Xóa product trong orderdetail
  deleteOrderDetails: async function (req, res, next) {
    try {
      const { id } = req.params;
      const { productId } = req.body;

      // Kiểm tra xem productId có tồn tại không
      if (!productId) {
        return res.status(400).json({
          code: 400,
          message: "Vui lòng cung cấp ID của sản phẩm cần xóa",
        });
      }

      // Xóa các order detail có productId trùng khớp với productId từ đơn hàng
      const updatedOrder = await Order.findByIdAndUpdate(
        id,
        {
          $pull: { orderDetails: { productId: productId } },
        },
        { new: true }
      );

      if (updatedOrder) {
        return res.status(200).json({
          code: 200,
          message: "Xóa sản phẩm khỏi chi tiết đơn hàng thành công",
          payload: updatedOrder,
        });
      }

      return res
        .status(404)
        .json({ code: 404, message: "Không tìm thấy đơn hàng" });
    } catch (error) {
      return res.status(500).json({ code: 500, error: error });
    }
  },

  //Cập nhật trạng thái đơn hàng 
  updateOrderStatus: async (req, res, next) => {
    try {
        // Lấy orderId từ các tham số URL
        const orderId = req.params.id;

        // Kiểm tra xem orderId có tồn tại không
        if (!orderId) {
            return res.status(400).json({ message: 'Vui lòng cung cấp ID của đơn hàng.' });
        }

        // Lấy trạng thái đơn hàng mới từ body của request
        const newOrderStatus = req.body.status;

        // Cập nhật trạng thái của đơn hàng
        const updatedOrder = await Order.findByIdAndUpdate(
            orderId,
            { status: newOrderStatus },
            { new: true }
        );

        if (!updatedOrder) {
            return res.status(404).json({ message: `Không tìm thấy đơn hàng với ID ${orderId}` });
        }

        // Xác định trạng thái và setup mới cho bàn dựa trên trạng thái của đơn hàng
        let newTableStatus;
        let newTableSetup;

        switch (newOrderStatus) {
            case 'WAITING':
                newTableStatus = 'Đã đặt';
                newTableSetup = 'Không có sẵn';
                break;
            case 'DELIVERING':
                newTableStatus = 'Đã đặt';
                newTableSetup = 'Có sẵn';
                break;
            case 'COMPLETED':
            case 'CANCELED':
                newTableStatus = 'Đang trống';
                newTableSetup = 'Không có sẵn';
                break;
            default:
                console.log('Trạng thái đơn hàng không hợp lệ.');
                return res.status(400).json({ message: 'Trạng thái đơn hàng không hợp lệ' });
        }

        // Cập nhật trạng thái và setup của bàn dựa trên tableId trong đơn hàng
        const updatedTable = await Table.findOneAndUpdate(
            { _id: updatedOrder.tableId },
            { status: newTableStatus, setup: newTableSetup },
            { new: true }
        );

        if (!updatedTable) {
            return res.status(404).json({ message: `Không tìm thấy bàn với ID: ${updatedOrder.tableId}` });
        }

        // Trả về phản hồi thành công
        return res.status(200).json({ message: `Cập nhật trạng thái của bàn ${updatedTable.name} thành công.` });

    } catch (error) {
        // Ghi log và trả về phản hồi lỗi
        return res.status(500).json({ error: `Lỗi khi cập nhật trạng thái của bàn: ${error}` });
    }
},

  updateIsDelete: async function (req, res, next) {
    const { selectedIds } = req.body;
    try {
      const result = await Order.updateMany(
        { _id: { $in: selectedIds } },
        { $set: { isDelete: true } }
      );
      res
        .status(200)
        .json({
          message: "Cập nhật thành công",
          success: true,
          payload: result,
        });
    } catch (error) {
      res.status(500).json({ error: "Đã xảy ra lỗi trong quá trình cập nhật" });
    }
  },
};
