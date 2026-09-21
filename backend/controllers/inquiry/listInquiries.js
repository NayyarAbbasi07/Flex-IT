const { inquiryService } = require('../../service');
const { StatusCodes } = require('http-status-codes');
const { CustomError } = require('../../utils/errorHandlers/CustomError');
const { inquiryStatusValues } = require('../../common/enumFunction');

module.exports = async function listInquiries(req, res, next) {
  try {
    const status = typeof req.query.status === 'string' ? req.query.status : undefined;
    if (status && !inquiryStatusValues.includes(status)) {
      throw new CustomError('Invalid status', 400);
    }
    const q = typeof req.query.q === 'string' ? req.query.q : undefined;
    const data = await inquiryService.listInquiries({ status, q });
    return res.status(StatusCodes.OK).json({ success: true, data: data.inquiries });
  } catch (error) {
    next(error);
  }
};
