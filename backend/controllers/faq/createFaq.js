const { faqService } = require('../../service');
const { StatusCodes } = require('http-status-codes');
const Joi = require('joi');
const { CustomError } = require('../../utils/errorHandlers/CustomError');

const schema = Joi.object().keys({
  question: Joi.string().min(3).required(),
  answer: Joi.string().min(1).required(),
  sortOrder: Joi.number().integer().optional(),
  enabled: Joi.boolean().optional(),
});

module.exports = async function createFaq(req, res, next) {
  try {
    const validate = await schema.validateAsync(req.body, { abortEarly: false });
    const data = await faqService.createFaq(validate);
    if (!data.success) throw new CustomError(data.message, data.statusCode);
    return res.status(StatusCodes.CREATED).json({
      success: true,
      message: 'FAQ created',
      data: data.faq,
    });
  } catch (error) {
    next(error);
  }
};
