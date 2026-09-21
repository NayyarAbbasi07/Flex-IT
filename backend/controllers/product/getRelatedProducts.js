const { catalogService } = require('../../service');
const { StatusCodes } = require('http-status-codes');
const { CustomError } = require('../../utils/errorHandlers/CustomError');
const { param } = require('../../utils/params');

module.exports = async function getRelatedProducts(req, res, next) {
  try {
    const data = await catalogService.getMappedRelated(param(req.params.slug));

    if (!data.success) {
      throw new CustomError(data.message, data.statusCode);
    }

    return res.status(StatusCodes.OK).json({
      success: true,
      message: 'Related products fetched',
      data: data.products,
    });
  } catch (error) {
    next(error);
  }
};
