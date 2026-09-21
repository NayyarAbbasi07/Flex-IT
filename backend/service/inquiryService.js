const { prisma } = require('./prisma');
const { InquiryStatus, InquirySource, Role } = require('../common/enumFunction');

const inquiryInclude = {
  product: { select: { id: true, name: true, slug: true, sku: true } },
  user: { select: { id: true, email: true, name: true } },
};

async function createInquiry(data, user) {
  if (data.productId) {
    const product = await prisma.product.findFirst({
      where: { id: data.productId, deletedAt: null },
    });
    if (!product) {
      return { success: false, message: 'Product not found', statusCode: 404 };
    }
  }

  const inquiry = await prisma.inquiry.create({
    data: {
      userId: user?.role === Role.CUSTOMER ? user.id : data.userId || null,
      productId: data.productId || null,
      size: data.size || null,
      name: data.name,
      phone: data.phone,
      email: data.email || null,
      city: data.city || null,
      message: data.message || '',
      status: InquiryStatus.NEW,
      source: data.source || InquirySource.WHATSAPP,
    },
    include: inquiryInclude,
  });

  return { success: true, inquiry };
}

async function listInquiries({ status, q } = {}) {
  const inquiries = await prisma.inquiry.findMany({
    where: {
      deletedAt: null,
      ...(status ? { status } : {}),
      ...(q
        ? {
            OR: [
              { name: { contains: q, mode: 'insensitive' } },
              { phone: { contains: q, mode: 'insensitive' } },
              { email: { contains: q, mode: 'insensitive' } },
              { message: { contains: q, mode: 'insensitive' } },
            ],
          }
        : {}),
    },
    include: inquiryInclude,
    orderBy: { createdAt: 'desc' },
  });
  return { success: true, inquiries };
}

async function listMyInquiries(userId) {
  const inquiries = await prisma.inquiry.findMany({
    where: { deletedAt: null, userId },
    include: inquiryInclude,
    orderBy: { createdAt: 'desc' },
  });
  return { success: true, inquiries };
}

async function getInquiry(id) {
  const inquiry = await prisma.inquiry.findFirst({
    where: { id, deletedAt: null },
    include: inquiryInclude,
  });
  if (!inquiry) {
    return { success: false, message: 'Inquiry not found', statusCode: 404 };
  }
  return { success: true, inquiry };
}

async function updateInquiry(id, data) {
  const existing = await prisma.inquiry.findFirst({ where: { id, deletedAt: null } });
  if (!existing) {
    return { success: false, message: 'Inquiry not found', statusCode: 404 };
  }
  const inquiry = await prisma.inquiry.update({
    where: { id },
    data: {
      status: data.status,
      message: data.message,
      city: data.city,
      size: data.size,
    },
    include: inquiryInclude,
  });
  return { success: true, inquiry };
}

module.exports = {
  createInquiry,
  listInquiries,
  listMyInquiries,
  getInquiry,
  updateInquiry,
};
