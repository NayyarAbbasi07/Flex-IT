const { productService } = require('../../service');
const { StatusCodes } = require('http-status-codes');

module.exports = async function listLowStock(req, res, next) {
  try {
    const data = await productService.listLowStock();
    return res.status(StatusCodes.OK).json({ success: true, data: data.items });
  } catch (error) {
    next(error);
  }
};
