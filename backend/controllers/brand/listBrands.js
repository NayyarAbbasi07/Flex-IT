const { brandService } = require('../../service');
const { StatusCodes } = require('http-status-codes');
const { CustomError } = require('../../utils/errorHandlers/CustomError');

module.exports = async function listBrands(req, res, next) {
  try {
    const data = await brandService.listBrands();

    if (!data.success) {
      throw new CustomError(data.message, data.statusCode);
    }

    return res.status(StatusCodes.OK).json({
      success: true,
      message: 'Brands fetched',
      data: data.brands,
    });
  } catch (error) {
    next(error);
  }
};
