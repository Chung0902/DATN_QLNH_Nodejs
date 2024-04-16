const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const tableSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Tên bàn không được bỏ trống'],
      maxlength: [100, 'Tên bàn không được vượt quá 100 ký tự'],
      unique: [true, 'Tên bàn không được trùng'],
    },
    numberOfSeats: {
      type: Number,
      required: [true, 'Số ghế không được bỏ trống'],
      min: [1, 'Số ghế tối thiểu là 1'],
    },
    setup: {
      type: String,
      maxlength: [500, 'Mô tả không được vượt quá 500 ký tự'],
    },
    status: {
      type: String,
      enum: ['Đang trống', 'Đã đặt'],
      default: 'Đang trống',
    },
    isDelete: {
      type: Boolean,
      default: false,
      required: [true, 'Trường isDelete là bắt buộc'],
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

const Table = model('Table', tableSchema);
module.exports = Table;
