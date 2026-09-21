/**
 * Single barrel for all controller actions.
 * Domain folders hold action files only — no per-folder index.js.
 */
module.exports = {
  // auth
  login: require('./auth/login'),
  logout: require('./auth/logout'),
  me: require('./auth/me'),
  register: require('./auth/register'),
  changePassword: require('./auth/changePassword'),

  // user (admin)
  listUsers: require('./user/listUsers'),
  createUser: require('./user/createUser'),
  updateUser: require('./user/updateUser'),
  deleteUser: require('./user/deleteUser'),

  // brand
  listBrands: require('./brand/listBrands'),
  createBrand: require('./brand/createBrand'),
  updateBrand: require('./brand/updateBrand'),
  deleteBrand: require('./brand/deleteBrand'),

  // category
  listCategories: require('./category/listCategories'),
  createCategory: require('./category/createCategory'),
  updateCategory: require('./category/updateCategory'),
  deleteCategory: require('./category/deleteCategory'),

  // product (admin + public)
  listProducts: require('./product/listProducts'),
  getProduct: require('./product/getProduct'),
  createProduct: require('./product/createProduct'),
  updateProduct: require('./product/updateProduct'),
  deleteProduct: require('./product/deleteProduct'),
  listPublicProducts: require('./product/listPublicProducts'),
  getProductBySlug: require('./product/getProductBySlug'),
  getRelatedProducts: require('./product/getRelatedProducts'),
  getFeaturedProducts: require('./product/getFeaturedProducts'),
  getLatestProducts: require('./product/getLatestProducts'),
  listLowStock: require('./product/listLowStock'),
  bulkUpdateProductStatus: require('./product/bulkUpdateProductStatus'),

  // media
  listMedia: require('./media/listMedia'),
  uploadMedia: require('./media/uploadMedia'),
  deleteMedia: require('./media/deleteMedia'),

  // settings
  getPublicSettings: require('./settings/getPublicSettings'),
  getAdminSettings: require('./settings/getAdminSettings'),
  updateSettings: require('./settings/updateSettings'),

  // hero
  getHero: require('./hero/getHero'),
  updateHero: require('./hero/updateHero'),

  // stats
  getStats: require('./stats/getStats'),

  // collection
  listCollections: require('./collection/listCollections'),
  getCollectionBySlug: require('./collection/getCollectionBySlug'),

  // catalog
  getShopCatalog: require('./catalog/getShopCatalog'),

  // faq
  listPublicFaqs: require('./faq/listPublicFaqs'),
  listFaqs: require('./faq/listFaqs'),
  createFaq: require('./faq/createFaq'),
  updateFaq: require('./faq/updateFaq'),
  deleteFaq: require('./faq/deleteFaq'),

  // testimonial
  listPublicTestimonials: require('./testimonial/listPublicTestimonials'),
  listTestimonials: require('./testimonial/listTestimonials'),
  createTestimonial: require('./testimonial/createTestimonial'),
  submitPublicTestimonial: require('./testimonial/submitPublicTestimonial'),
  updateTestimonial: require('./testimonial/updateTestimonial'),
  deleteTestimonial: require('./testimonial/deleteTestimonial'),

  // inquiry
  createInquiry: require('./inquiry/createInquiry'),
  listInquiries: require('./inquiry/listInquiries'),
  listMyInquiries: require('./inquiry/listMyInquiries'),
  getInquiry: require('./inquiry/getInquiry'),
  updateInquiry: require('./inquiry/updateInquiry'),

  // order
  createOrder: require('./order/createOrder'),
  listOrders: require('./order/listOrders'),
  listMyOrders: require('./order/listMyOrders'),
  getOrder: require('./order/getOrder'),
  updateOrder: require('./order/updateOrder'),
};
