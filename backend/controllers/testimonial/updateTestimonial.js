const { testimonialService } = require('../../service');
const { StatusCodes } = require('http-status-codes');
const Joi = require('joi');
const { CustomError } = require('../../utils/errorHandlers/CustomError');
const { param } = require('../../utils/params');

const schema = Joi.object().keys({
  name: Joi.string().min(1).optional(),
  rating: Joi.number().integer().min(1).max(5).optional(),
  comment: Joi.string().min(1).optional(),
  productName: Joi.string().allow(null, '').optional(),
  location: Joi.string().allow(null, '').optional(),
  sortOrder: Joi.number().integer().optional(),
  enabled: Joi.boolean().optional(),
});

module.exports = async function updateTestimonial(req, res, next) {
  try {
    const validate = await schema.validateAsync(req.body, { abortEarly: false });
    const data = await testimonialService.updateTestimonial(param(req.params.id), validate);
    if (!data.success) throw new CustomError(data.message, data.statusCode);
    return res.status(StatusCodes.OK).json({
      success: true,
      message: 'Testimonial updated',
      data: data.testimonial,
    });
  } catch (error) {
    next(error);
  }
};
