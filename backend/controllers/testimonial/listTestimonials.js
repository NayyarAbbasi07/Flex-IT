const { testimonialService } = require('../../service');
const { StatusCodes } = require('http-status-codes');

module.exports = async function listTestimonials(req, res, next) {
  try {
    const data = await testimonialService.listTestimonials();
    return res.status(StatusCodes.OK).json({ success: true, data: data.testimonials });
  } catch (error) {
    next(error);
  }
};
