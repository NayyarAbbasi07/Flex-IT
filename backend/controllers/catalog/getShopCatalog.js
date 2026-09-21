const { catalogService } = require('../../service');
const { StatusCodes } = require('http-status-codes');
const { CustomError } = require('../../utils/errorHandlers/CustomError');

module.exports = async function getShopCatalog(req, res, next) {
  try {
    const data = await catalogService.getShopCatalog();

    if (!data.success) {
      throw new CustomError(data.message, data.statusCode);
    }

    return res.status(StatusCodes.OK).json({
      success: true,
      message: 'Catalog fetched',
      data: data.catalog,
    });
  } catch (error) {
    next(error);
  }
};
