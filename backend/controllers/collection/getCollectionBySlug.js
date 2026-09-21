const { collectionService } = require('../../service');
const { StatusCodes } = require('http-status-codes');
const { CustomError } = require('../../utils/errorHandlers/CustomError');
const { param } = require('../../utils/params');

module.exports = async function getCollectionBySlug(req, res, next) {
  try {
    const data = await collectionService.getCollectionBySlug(param(req.params.slug));

    if (!data.success) {
      throw new CustomError(data.message, data.statusCode);
    }

    return res.status(StatusCodes.OK).json({
      success: true,
      message: 'Collection fetched',
      data: data.collection,
    });
  } catch (error) {
    next(error);
  }
};
