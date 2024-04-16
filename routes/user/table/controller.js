const { Table } = require("../../../models");

module.exports = {
  getTableAll: async (req, res, next) => {
    try {
      let results = await Table.find();

      // Add Cache-Control header to the response
      res.set('Cache-Control', 'no-cache, no-store, must-revalidate');

      return res.send({ code: 200, payload: results });
    } catch (err) {
      return res.status(500).json({ code: 500, error: err });
    }
  },

  getTableDetail: async (req, res, next) => {
    try {
      const { id } = req.params;

      let found = await Table.findById(id);

      if (found) {
        return res.send({ code: 200, payload: found });
      }

      return res.status(410).send({ code: 404, message: "Không tìm thấy" });
    } catch (err) {
      return res.status(500).json({ code: 500, error: err });
    }
  },

  createTable: async function (req, res, next) {
    try {
      const data = req.body;

      const newItem = new Table(data);

      let result = await newItem.save();

      return res.send({
        code: 200,
        message: "Tạo thành công",
        payload: result,
      });
    } catch (err) {
      return res.status(500).json({ code: 500, error: err });
    }
  },

  deleteTable: async function (req, res, next) {
    try {
      const { id } = req.params;

      let found = await Table.findByIdAndDelete(id);

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

  updateTable: async function (req, res, next) {
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
  },
};
