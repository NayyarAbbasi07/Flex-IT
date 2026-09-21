const { mediaService } = require('../../service');
const { StatusCodes } = require('http-status-codes');
const { CustomError } = require('../../utils/errorHandlers/CustomError');

module.exports = async function listMedia(req, res, next) {
  try {
    const q = typeof req.query.q === 'string' ? req.query.q : undefined;
    const data = await mediaService.listMedia(q);

    if (!data.success) {
      throw new CustomError(data.message, data.statusCode);
    }

    return res.status(StatusCodes.OK).json({
      success: true,
      message: 'Media fetched',
      data: data.media,
    });
  } catch (error) {
    next(error);
  }
};
