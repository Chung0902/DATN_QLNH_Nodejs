const { Table } = require("../../../models");

const getTableAll = async (req, res, next) => {
  try {
    const results = await Table.find();
    res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    return res.send({ code: 200, payload: results });
  } catch (err) {
    return res.status(500).json({ code: 500, error: err });
  }
};

const getTableDetail = async (req, res, next) => {
  try {
    const { id } = req.params;
    const found = await Table.findById(id);
    if (found) {
      return res.send({ code: 200, payload: found });
    }
    return res.status(404).send({ code: 404, message: "Không tìm thấy" });
  } catch (err) {
    return res.status(500).json({ code: 500, error: err });
  }
};

const createTable = async (req, res, next) => {
  try {
    const data = req.body;

    // Kiểm tra xem dữ liệu gửi lên có chứa đủ các trường cần thiết không
    const requiredFields = ['name', 'numberOfSeats'];
    for (const field of requiredFields) {
      if (!(field in data)) {
        return res.status(400).json({ code: 400, error: `${field} không được bỏ trống` });
      }
    }

    // Kiểm tra xem trường numberOfSeats có phải là số không âm không
    if (isNaN(data.numberOfSeats) || data.numberOfSeats < 0) {
      return res.status(400).json({ code: 400, error: "Số ghế phải là một số không âm" });
    }

    // Kiểm tra xem trường isDelete có phải là boolean không
    // if (typeof data.isDelete !== 'boolean') {
    //   return res.status(400).json({ code: 400, error: "Trường isDelete phải là một giá trị boolean" });
    // }

    // Tiến hành tạo bản ghi mới
    const newItem = new Table(data);
    const result = await newItem.save();
    return res.status(201).json({
      code: 201,
      message: "Tạo thành công",
      payload: result,
    });
  } catch (err) {
    return res.status(500).json({ code: 500, error: err.message });
  }
};


const deleteTable = async (req, res, next) => {
  try {
    const { id } = req.params;
    const found = await Table.findByIdAndDelete(id);
    if (found) {
      return res.send({
        code: 200,
        payload: found,
        message: "Xóa thành công",
      });
    }
    return res.status(404).send({ code: 404, message: "Không tìm thấy" });
  } catch (err) {
    return res.status(500).json({ code: 500, error: err });
  }
};

const updateTable = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const found = await Table.findByIdAndUpdate(id, updateData, {
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
  } catch (err) {
    return res.status(500).json({ code: 500, error: err });
  }
};

module.exports = { getTableAll, getTableDetail, createTable, deleteTable, updateTable };
