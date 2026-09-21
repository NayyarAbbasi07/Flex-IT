const { testimonialService } = require('../../service');
const { StatusCodes } = require('http-status-codes');
const Joi = require('joi');
const { CustomError } = require('../../utils/errorHandlers/CustomError');

const schema = Joi.object().keys({
  name: Joi.string().min(1).max(120).required(),
  rating: Joi.number().integer().min(1).max(5).optional(),
  comment: Joi.string().min(3).max(2000).required(),
  productName: Joi.string().max(200).allow(null, '').optional(),
  location: Joi.string().max(120).allow(null, '').optional(),
});

module.exports = async function submitPublicTestimonial(req, res, next) {
  try {
    const validate = await schema.validateAsync(req.body, { abortEarly: false });
    const data = await testimonialService.createPublicTestimonial(validate);
    if (!data.success) throw new CustomError(data.message, data.statusCode);
    return res.status(StatusCodes.CREATED).json({
      success: true,
      message: 'Thank you! Your review was submitted and will appear after we approve it.',
      data: { id: data.testimonial.id },
    });
  } catch (error) {
    next(error);
  }
};
