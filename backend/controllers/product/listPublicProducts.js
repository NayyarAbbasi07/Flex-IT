const { catalogService } = require('../../service');
const { StatusCodes } = require('http-status-codes');
const { CustomError } = require('../../utils/errorHandlers/CustomError');

module.exports = async function listPublicProducts(req, res, next) {
  try {
    const sp = req.query;
    const data = await catalogService.listMappedProducts({
      search: typeof sp.q === 'string' ? sp.q : undefined,
      brand:
        typeof sp.brand === 'string'
          ? sp.brand
          : typeof sp.collection === 'string'
            ? sp.collection
            : undefined,
      size: typeof sp.size === 'string' ? sp.size : undefined,
      featured: sp.featured === 'true',
      availableOnly: sp.available === 'true',
      newArrival: sp.newest === 'true' || sp.newArrival === 'true',
      sort: typeof sp.sort === 'string' ? sp.sort : 'newest',
    });

    if (!data.success) {
      throw new CustomError(data.message, data.statusCode);
    }

    return res.status(StatusCodes.OK).json({
      success: true,
      message: 'Products fetched',
      data: data.products,
    });
  } catch (error) {
    next(error);
  }
};
