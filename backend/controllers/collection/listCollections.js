const { collectionService } = require('../../service');
const { StatusCodes } = require('http-status-codes');
const { CustomError } = require('../../utils/errorHandlers/CustomError');

module.exports = async function listCollections(req, res, next) {
  try {
    const data = await collectionService.getCollections();

    if (!data.success) {
      throw new CustomError(data.message, data.statusCode);
    }

    return res.status(StatusCodes.OK).json({
      success: true,
      message: 'Collections fetched',
      data: data.collections,
    });
  } catch (error) {
    next(error);
  }
};
