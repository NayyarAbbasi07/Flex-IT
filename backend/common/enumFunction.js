/**
 * Shared enums for the Flex it! API.
 * Keep values in sync with prisma/schema.prisma.
 */

/** Use on routes: authenticationMiddleware([RoleAuthorizationTypes.Admin]) */
const RoleAuthorizationTypes = Object.freeze({
  Admin: 'ADMIN',
  Customer: 'CUSTOMER',
});

const Role = Object.freeze({
  ADMIN: RoleAuthorizationTypes.Admin,
  CUSTOMER: RoleAuthorizationTypes.Customer,
});

const ProductStatus = Object.freeze({
  DRAFT: 'DRAFT',
  PUBLISHED: 'PUBLISHED',
  ARCHIVED: 'ARCHIVED',
});

const ConditionGrade = Object.freeze({
  A_PLUS: 'A_PLUS',
  A: 'A',
  B_PLUS: 'B_PLUS',
  B: 'B',
});

const Gender = Object.freeze({
  MEN: 'MEN',
  WOMEN: 'WOMEN',
  UNISEX: 'UNISEX',
});

const InquiryStatus = Object.freeze({
  NEW: 'NEW',
  CONTACTED: 'CONTACTED',
  CLOSED: 'CLOSED',
});

const InquirySource = Object.freeze({
  WHATSAPP: 'WHATSAPP',
  WEB: 'WEB',
});

const OrderStatus = Object.freeze({
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  SHIPPED: 'SHIPPED',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED',
});

function enumValues(enumObj) {
  return Object.values(enumObj);
}

module.exports = {
  RoleAuthorizationTypes,
  Role,
  ProductStatus,
  ConditionGrade,
  Gender,
  InquiryStatus,
  InquirySource,
  OrderStatus,
  enumValues,
  roleValues: enumValues(RoleAuthorizationTypes),
  productStatusValues: enumValues(ProductStatus),
  conditionGradeValues: enumValues(ConditionGrade),
  genderValues: enumValues(Gender),
  inquiryStatusValues: enumValues(InquiryStatus),
  inquirySourceValues: enumValues(InquirySource),
  orderStatusValues: enumValues(OrderStatus),
};
