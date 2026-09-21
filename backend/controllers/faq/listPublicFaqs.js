const { faqService } = require('../../service');
const { StatusCodes } = require('http-status-codes');

module.exports = async function listPublicFaqs(req, res, next) {
  try {
    const data = await faqService.listPublicFaqs();
    return res.status(StatusCodes.OK).json({ success: true, data: data.faqs });
  } catch (error) {
    next(error);
  }
};
