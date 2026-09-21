const { faqService } = require('../../service');
const { StatusCodes } = require('http-status-codes');

module.exports = async function listFaqs(req, res, next) {
  try {
    const data = await faqService.listFaqs();
    return res.status(StatusCodes.OK).json({ success: true, data: data.faqs });
  } catch (error) {
    next(error);
  }
};
