const { inquiryService } = require('../../service');
const { StatusCodes } = require('http-status-codes');
const { CustomError } = require('../../utils/errorHandlers/CustomError');
const { param } = require('../../utils/params');

module.exports = async function getInquiry(req, res, next) {
  try {
    const data = await inquiryService.getInquiry(param(req.params.id));
    if (!data.success) throw new CustomError(data.message, data.statusCode);
    return res.status(StatusCodes.OK).json({ success: true, data: data.inquiry });
  } catch (error) {
    next(error);
  }
};
