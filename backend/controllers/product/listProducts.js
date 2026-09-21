const { productService } = require('../../service');
const { StatusCodes } = require('http-status-codes');
const { CustomError } = require('../../utils/errorHandlers/CustomError');

module.exports = async function listProducts(req, res, next) {
  try {
    const q = typeof req.query.q === 'string' ? req.query.q : undefined;
    const status = typeof req.query.status === 'string' ? req.query.status : undefined;
    const brandId = typeof req.query.brandId === 'string' ? req.query.brandId : undefined;
    const categoryId =
      typeof req.query.categoryId === 'string' ? req.query.categoryId : undefined;
    const page = req.query.page ? Number(req.query.page) : 1;
    const pageSize = req.query.pageSize ? Number(req.query.pageSize) : 20;

    const data = await productService.listProducts({
      q,
      status,
      brandId,
      categoryId,
      page,
      pageSize,
    });

    if (!data.success) {
      throw new CustomError(data.message, data.statusCode);
    }

    return res.status(StatusCodes.OK).json({
      success: true,
      message: 'Products fetched',
      data: data.products,
      pagination: data.pagination,
    });
  } catch (error) {
    next(error);
  }
};
