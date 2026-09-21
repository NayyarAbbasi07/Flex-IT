const { productService } = require('../../service');
const { StatusCodes } = require('http-status-codes');
const { CustomError } = require('../../utils/errorHandlers/CustomError');
const { param } = require('../../utils/params');

module.exports = async function getProduct(req, res, next) {
  try {
    const data = await productService.getProduct(param(req.params.id));

    if (!data.success) {
      throw new CustomError(data.message, data.statusCode);
    }

    return res.status(StatusCodes.OK).json({
      success: true,
      message: 'Product fetched',
      data: data.product,
    });
  } catch (error) {
    next(error);
  }
};
