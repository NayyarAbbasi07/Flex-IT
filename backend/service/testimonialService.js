const { prisma } = require('./prisma');

async function listPublicTestimonials() {
  const testimonials = await prisma.testimonial.findMany({
    where: { deletedAt: null, enabled: true },
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
  });
  return { success: true, testimonials };
}

async function listTestimonials() {
  const testimonials = await prisma.testimonial.findMany({
    where: { deletedAt: null },
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
  });
  return { success: true, testimonials };
}

async function createTestimonial(data) {
  const testimonial = await prisma.testimonial.create({
    data: {
      name: data.name,
      rating: data.rating ?? 5,
      comment: data.comment,
      productName: data.productName || null,
      location: data.location || null,
      sortOrder: data.sortOrder ?? 0,
      enabled: data.enabled ?? true,
    },
  });
  return { success: true, testimonial };
}

async function createPublicTestimonial(data) {
  const testimonial = await prisma.testimonial.create({
    data: {
      name: data.name,
      rating: data.rating ?? 5,
      comment: data.comment,
      productName: data.productName || null,
      location: data.location || null,
      sortOrder: 0,
      enabled: false,
    },
  });
  return { success: true, testimonial };
}

async function updateTestimonial(id, data) {
  const existing = await prisma.testimonial.findFirst({ where: { id, deletedAt: null } });
  if (!existing) {
    return { success: false, message: 'Testimonial not found', statusCode: 404 };
  }
  const testimonial = await prisma.testimonial.update({
    where: { id },
    data: {
      name: data.name,
      rating: data.rating,
      comment: data.comment,
      productName: data.productName,
      location: data.location,
      sortOrder: data.sortOrder,
      enabled: data.enabled,
    },
  });
  return { success: true, testimonial };
}

async function deleteTestimonial(id) {
  const existing = await prisma.testimonial.findFirst({ where: { id, deletedAt: null } });
  if (!existing) {
    return { success: false, message: 'Testimonial not found', statusCode: 404 };
  }
  await prisma.testimonial.update({ where: { id }, data: { deletedAt: new Date() } });
  return { success: true, testimonial: { id } };
}

module.exports = {
  listPublicTestimonials,
  listTestimonials,
  createTestimonial,
  createPublicTestimonial,
  updateTestimonial,
  deleteTestimonial,
};
