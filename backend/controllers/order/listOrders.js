const { orderService } = require('../../service');
const { StatusCodes } = require('http-status-codes');
const { CustomError } = require('../../utils/errorHandlers/CustomError');
const { orderStatusValues } = require('../../common/enumFunction');

module.exports = async function listOrders(req, res, next) {
  try {
    const status = typeof req.query.status === 'string' ? req.query.status : undefined;
    if (status && !orderStatusValues.includes(status)) {
      throw new CustomError('Invalid status', 400);
    }
    const data = await orderService.listOrders({ status });
    return res.status(StatusCodes.OK).json({ success: true, data: data.orders });
  } catch (error) {
    next(error);
  }
};
