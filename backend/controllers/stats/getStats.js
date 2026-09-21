const { statsService } = require('../../service');
const { StatusCodes } = require('http-status-codes');
const { CustomError } = require('../../utils/errorHandlers/CustomError');

module.exports = async function getStats(req, res, next) {
  try {
    const data = await statsService.getDashboardStats();

    if (!data.success) {
      throw new CustomError(data.message, data.statusCode);
    }

    return res.status(StatusCodes.OK).json({
      success: true,
      message: 'Stats fetched',
      data: data.stats,
    });
  } catch (error) {
    next(error);
  }
};
