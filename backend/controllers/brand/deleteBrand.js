const { brandService } = require('../../service');
const { StatusCodes } = require('http-status-codes');
const Joi = require('joi');
const { CustomError } = require('../../utils/errorHandlers/CustomError');

const schema = Joi.object().keys({
  id: Joi.string().uuid().required(),
});

module.exports = async function deleteBrand(req, res, next) {
  try {
    const validate = await schema.validateAsync(req.query, { abortEarly: false });
    const data = await brandService.deleteBrand(validate.id);

    if (!data.success) {
      throw new CustomError(data.message, data.statusCode);
    }

    return res.status(StatusCodes.OK).json({
      success: true,
      message: 'Brand deleted',
      data: data.brand,
    });
  } catch (error) {
    next(error);
  }
};
