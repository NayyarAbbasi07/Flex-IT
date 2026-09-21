const { testimonialService } = require('../../service');
const { StatusCodes } = require('http-status-codes');
const { CustomError } = require('../../utils/errorHandlers/CustomError');
const { param } = require('../../utils/params');

module.exports = async function deleteTestimonial(req, res, next) {
  try {
    const data = await testimonialService.deleteTestimonial(param(req.params.id));
    if (!data.success) throw new CustomError(data.message, data.statusCode);
    return res.status(StatusCodes.OK).json({
      success: true,
      message: 'Testimonial deleted',
      data: data.testimonial,
    });
  } catch (error) {
    next(error);
  }
};
