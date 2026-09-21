const { settingsService } = require('../../service');
const { StatusCodes } = require('http-status-codes');
const { CustomError } = require('../../utils/errorHandlers/CustomError');

module.exports = async function getPublicSettings(req, res, next) {
  try {
    const data = await settingsService.getStoreSettings();

    if (!data.success) {
      throw new CustomError(data.message, data.statusCode);
    }

    const settings = data.settings;
    return res.status(StatusCodes.OK).json({
      success: true,
      message: 'Settings fetched',
      data: {
        brandName: settings.brandName,
        tagline: settings.tagline,
        phone: settings.phone,
        email: settings.email,
        address: settings.address,
        whatsappNumber: settings.whatsappNumber,
        whatsappDefaultMessage: settings.whatsappDefaultMessage,
        businessHours: settings.businessHours,
        shippingInfo: settings.shippingInfo,
        returnPolicy: settings.returnPolicy,
        social: {
          instagram: settings.instagram,
          facebook: settings.facebook,
          tiktok: settings.tiktok,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};
