const { orderService } = require('../../service');
const { StatusCodes } = require('http-status-codes');

module.exports = async function listMyOrders(req, res, next) {
  try {
    const data = await orderService.listMyOrders(req.user.id);
    return res.status(StatusCodes.OK).json({ success: true, data: data.orders });
  } catch (error) {
    next(error);
  }
};
