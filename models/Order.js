const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const DEFAULT_EMPLOYEE_ID = '647efdae66502ca93f65d13d';

const orderDetailSchema = new Schema(
  {
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, require: false, min: 0 },
    price: { type: Number, required: false, min: 0, default: 0 },
  },
  {
    versionKey: false,
  },
);

// Virtual with Populate
orderDetailSchema.virtual('product', {
  ref: 'Product',
  localField: 'productId',
  foreignField: '_id',
  justOne: true,
});

// Virtuals in console.log()
orderDetailSchema.set('toObject', { virtuals: true });
// Virtuals in JSON
orderDetailSchema.set('toJSON', { virtuals: true });

// ------------------------------------------------------------------------------------------------

const orderSchema = new Schema(
  {
    createdDate: {
      type: Date,
      required: true,
      default: Date.now,
    },

    shippedDate: {
      type: Date,
      validate: {
        validator: function (value) {
          if (!value) return true;

          if (value < this.createdDate) {
            return false;
          }

          return true;
        },
        message: `Shipped date: {VALUE} is invalid!`,
      },
    },


    paymentType: {
      type: String,
      required: true,
      default: 'CASH',
      enum: ['CASH', 'CREDIT CARD'],
    },

    status: {
      type: String,
      required: true,
      enum: ['WAITING', 'COMPLETED', 'CANCELED', 'DELIVERING'],
      default: 'WAITING',
    },
    description: {
      type: String,
    },
    shippingAddress: {
      type: String,
      // require: [true, "Vui lòng nhập địa chỉ"],
      maxLength: [500, "Địa chỉ không được vượt quá 500 ký tự"],
    },
    discount: { type: Number, default: 0 },
    customerId: { type: Schema.Types.ObjectId, ref: 'Customer', required: true },
    employeeId: { type: Schema.Types.ObjectId, ref: 'Employee', default: DEFAULT_EMPLOYEE_ID },
    tableId: { type: Schema.Types.ObjectId, ref: 'Table'},

    // Array
    orderDetails: [orderDetailSchema],
    isDelete: {
      type: Boolean,
      default: false,
      required: true,
    },

    reservationDate: {
      type: Date,
      // required: true,
    },

    reservationTime: {
      type: String,
      // required: true,
      validate: {
        validator: function (value) {
          return /([01]\d|2[0-3]):([0-5]\d)/.test(value);
        },
        message: `Reservation time: {VALUE} is invalid!`,
      },
    },

  },
  {
    versionKey: false,
  },
);

// Virtual with Populate
orderSchema.virtual('customer', {
  ref: 'Customer',
  localField: 'customerId',
  foreignField: '_id',
  justOne: true,
});

orderSchema.virtual('employee', {
  ref: 'Employee',
  localField: 'employeeId',
  foreignField: '_id',
  justOne: true,
});

orderSchema.virtual('table', {
  ref: 'Table',
  localField: 'tableId',
  foreignField: '_id',
  justOne: true,
});

// Virtuals in console.log()
orderSchema.set('toObject', { virtuals: true });
// Virtuals in JSON
orderSchema.set('toJSON', { virtuals: true });

const Order = model('Order', orderSchema);
module.exports = Order;
