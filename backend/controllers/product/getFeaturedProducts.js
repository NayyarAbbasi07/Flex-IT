const { catalogService } = require('../../service');
const { StatusCodes } = require('http-status-codes');
const { CustomError } = require('../../utils/errorHandlers/CustomError');

module.exports = async function getFeaturedProducts(req, res, next) {
  try {
    const data = await catalogService.getFeaturedProducts(4);

    if (!data.success) {
      throw new CustomError(data.message, data.statusCode);
    }

    return res.status(StatusCodes.OK).json({
      success: true,
      message: 'Featured products fetched',
      data: data.products,
    });
  } catch (error) {
    next(error);
  }
};
