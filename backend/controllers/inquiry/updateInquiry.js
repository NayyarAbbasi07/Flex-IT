const { inquiryService } = require('../../service');
const { StatusCodes } = require('http-status-codes');
const Joi = require('joi');
const { CustomError } = require('../../utils/errorHandlers/CustomError');
const { param } = require('../../utils/params');
const { inquiryStatusValues } = require('../../common/enumFunction');

const schema = Joi.object().keys({
  status: Joi.string().valid(...inquiryStatusValues).optional(),
  message: Joi.string().allow('').optional(),
  city: Joi.string().allow(null, '').optional(),
  size: Joi.string().allow(null, '').optional(),
});

module.exports = async function updateInquiry(req, res, next) {
  try {
    const validate = await schema.validateAsync(req.body, { abortEarly: false });
    const data = await inquiryService.updateInquiry(param(req.params.id), validate);
    if (!data.success) throw new CustomError(data.message, data.statusCode);
    return res.status(StatusCodes.OK).json({
      success: true,
      message: 'Inquiry updated',
      data: data.inquiry,
    });
  } catch (error) {
    next(error);
  }
};
