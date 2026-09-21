const { catalogService } = require('../../service');
const { StatusCodes } = require('http-status-codes');
const { CustomError } = require('../../utils/errorHandlers/CustomError');

module.exports = async function getLatestProducts(req, res, next) {
  try {
    const data = await catalogService.getLatestProducts(8);

    if (!data.success) {
      throw new CustomError(data.message, data.statusCode);
    }

    return res.status(StatusCodes.OK).json({
      success: true,
      message: 'Latest products fetched',
      data: data.products,
    });
  } catch (error) {
    next(error);
  }
};
