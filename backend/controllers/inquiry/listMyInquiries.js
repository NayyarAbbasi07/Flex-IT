const { inquiryService } = require('../../service');
const { StatusCodes } = require('http-status-codes');

module.exports = async function listMyInquiries(req, res, next) {
  try {
    const data = await inquiryService.listMyInquiries(req.user.id);
    return res.status(StatusCodes.OK).json({ success: true, data: data.inquiries });
  } catch (error) {
    next(error);
  }
};
