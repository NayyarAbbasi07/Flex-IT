const { settingsService } = require('../../service');
const { StatusCodes } = require('http-status-codes');
const { CustomError } = require('../../utils/errorHandlers/CustomError');

module.exports = async function getAdminSettings(req, res, next) {
  try {
    const data = await settingsService.getStoreSettings();

    if (!data.success) {
      throw new CustomError(data.message, data.statusCode);
    }

    return res.status(StatusCodes.OK).json({
      success: true,
      message: 'Settings fetched',
      data: data.settings,
    });
  } catch (error) {
    next(error);
  }
};
