const { heroService } = require('../../service');
const { StatusCodes } = require('http-status-codes');
const { CustomError } = require('../../utils/errorHandlers/CustomError');

module.exports = async function getHero(req, res, next) {
  try {
    const data = await heroService.getOrCreateHero();

    if (!data.success) {
      throw new CustomError(data.message, data.statusCode);
    }

    return res.status(StatusCodes.OK).json({
      success: true,
      message: 'Hero fetched',
      data: data.hero,
    });
  } catch (error) {
    next(error);
  }
};
