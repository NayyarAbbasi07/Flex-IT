const { categoryService } = require('../../service');
const { StatusCodes } = require('http-status-codes');
const { CustomError } = require('../../utils/errorHandlers/CustomError');

module.exports = async function listCategories(req, res, next) {
  try {
    const data = await categoryService.listCategories();

    if (!data.success) {
      throw new CustomError(data.message, data.statusCode);
    }

    return res.status(StatusCodes.OK).json({
      success: true,
      message: 'Categories fetched',
      data: data.categories,
    });
  } catch (error) {
    next(error);
  }
};
