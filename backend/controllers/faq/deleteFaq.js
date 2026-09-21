const { faqService } = require('../../service');
const { StatusCodes } = require('http-status-codes');
const { CustomError } = require('../../utils/errorHandlers/CustomError');
const { param } = require('../../utils/params');

module.exports = async function deleteFaq(req, res, next) {
  try {
    const data = await faqService.deleteFaq(param(req.params.id));
    if (!data.success) throw new CustomError(data.message, data.statusCode);
    return res.status(StatusCodes.OK).json({
      success: true,
      message: 'FAQ deleted',
      data: data.faq,
    });
  } catch (error) {
    next(error);
  }
};
