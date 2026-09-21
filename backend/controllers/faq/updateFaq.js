const { faqService } = require('../../service');
const { StatusCodes } = require('http-status-codes');
const Joi = require('joi');
const { CustomError } = require('../../utils/errorHandlers/CustomError');
const { param } = require('../../utils/params');

const schema = Joi.object().keys({
  question: Joi.string().min(3).optional(),
  answer: Joi.string().min(1).optional(),
  sortOrder: Joi.number().integer().optional(),
  enabled: Joi.boolean().optional(),
});

module.exports = async function updateFaq(req, res, next) {
  try {
    const validate = await schema.validateAsync(req.body, { abortEarly: false });
    const data = await faqService.updateFaq(param(req.params.id), validate);
    if (!data.success) throw new CustomError(data.message, data.statusCode);
    return res.status(StatusCodes.OK).json({
      success: true,
      message: 'FAQ updated',
      data: data.faq,
    });
  } catch (error) {
    next(error);
  }
};
