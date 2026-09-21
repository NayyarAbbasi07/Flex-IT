const { prisma } = require('./prisma');

async function listPublicFaqs() {
  const faqs = await prisma.faq.findMany({
    where: { deletedAt: null, enabled: true },
    orderBy: [{ sortOrder: 'asc' }, { question: 'asc' }],
  });
  return { success: true, faqs };
}

async function listFaqs() {
  const faqs = await prisma.faq.findMany({
    where: { deletedAt: null },
    orderBy: [{ sortOrder: 'asc' }, { question: 'asc' }],
  });
  return { success: true, faqs };
}

async function createFaq(data) {
  const faq = await prisma.faq.create({
    data: {
      question: data.question,
      answer: data.answer,
      sortOrder: data.sortOrder ?? 0,
      enabled: data.enabled ?? true,
    },
  });
  return { success: true, faq };
}

async function updateFaq(id, data) {
  const existing = await prisma.faq.findFirst({ where: { id, deletedAt: null } });
  if (!existing) {
    return { success: false, message: 'FAQ not found', statusCode: 404 };
  }
  const faq = await prisma.faq.update({
    where: { id },
    data: {
      question: data.question,
      answer: data.answer,
      sortOrder: data.sortOrder,
      enabled: data.enabled,
    },
  });
  return { success: true, faq };
}

async function deleteFaq(id) {
  const existing = await prisma.faq.findFirst({ where: { id, deletedAt: null } });
  if (!existing) {
    return { success: false, message: 'FAQ not found', statusCode: 404 };
  }
  await prisma.faq.update({ where: { id }, data: { deletedAt: new Date() } });
  return { success: true, faq: { id } };
}

module.exports = {
  listPublicFaqs,
  listFaqs,
  createFaq,
  updateFaq,
  deleteFaq,
};
