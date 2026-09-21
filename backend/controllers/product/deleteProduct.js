const { productService } = require('../../service');
const { StatusCodes } = require('http-status-codes');
const { CustomError } = require('../../utils/errorHandlers/CustomError');
const { param } = require('../../utils/params');

module.exports = async function deleteProduct(req, res, next) {
  try {
    const data = await productService.deleteProduct(param(req.params.id));

    if (!data.success) {
      throw new CustomError(data.message, data.statusCode);
    }

    return res.status(StatusCodes.OK).json({
      success: true,
      message: 'Product deleted',
      data: data.product,
    });
  } catch (error) {
    next(error);
  }
};
