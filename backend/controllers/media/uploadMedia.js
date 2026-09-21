const { mediaService } = require('../../service');
const { StatusCodes } = require('http-status-codes');
const { CustomError } = require('../../utils/errorHandlers/CustomError');

module.exports = async function uploadMedia(req, res, next) {
  try {
    const file = req.file;
    if (!file) {
      throw new CustomError('No file uploaded', 400);
    }

    const data = await mediaService.uploadMedia({
      buffer: file.buffer,
      originalName: file.originalname || 'upload',
      mimeType: file.mimetype || 'application/octet-stream',
      size: file.size,
      folder: typeof req.body.folder === 'string' ? req.body.folder : 'uploads',
      alt: typeof req.body.alt === 'string' ? req.body.alt : '',
    });

    if (!data.success) {
      throw new CustomError(data.message, data.statusCode);
    }

    return res.status(StatusCodes.CREATED).json({
      success: true,
      message: 'Media uploaded',
      data: data.asset,
    });
  } catch (error) {
    next(error);
  }
};
