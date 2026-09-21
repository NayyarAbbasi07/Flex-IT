const { productService } = require('../../service');
const { StatusCodes } = require('http-status-codes');
const Joi = require('joi');
const { CustomError } = require('../../utils/errorHandlers/CustomError');
const { productStatusValues } = require('../../common/enumFunction');

const schema = Joi.object().keys({
  ids: Joi.array().items(Joi.string().uuid()).min(1).required(),
  status: Joi.string().valid(...productStatusValues).required(),
});

module.exports = async function bulkUpdateProductStatus(req, res, next) {
  try {
    const validate = await schema.validateAsync(req.body, { abortEarly: false });
    const data = await productService.bulkUpdateStatus(validate.ids, validate.status);
    if (!data.success) throw new CustomError(data.message, data.statusCode);
    return res.status(StatusCodes.OK).json({
      success: true,
      message: 'Products updated',
      data: data.result,
    });
  } catch (error) {
    next(error);
  }
};
