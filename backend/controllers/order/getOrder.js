const { orderService } = require('../../service');
const { StatusCodes } = require('http-status-codes');
const { CustomError } = require('../../utils/errorHandlers/CustomError');
const { param } = require('../../utils/params');

module.exports = async function getOrder(req, res, next) {
  try {
    const data = await orderService.getOrder(param(req.params.id));
    if (!data.success) throw new CustomError(data.message, data.statusCode);
    return res.status(StatusCodes.OK).json({ success: true, data: data.order });
  } catch (error) {
    next(error);
  }
};
