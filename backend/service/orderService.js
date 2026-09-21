const { prisma } = require('./prisma');
const { OrderStatus } = require('../common/enumFunction');

const orderInclude = {
  items: { include: { product: { select: { id: true, name: true, slug: true, sku: true } } } },
  user: { select: { id: true, email: true, name: true } },
};

async function listOrders({ status } = {}) {
  const orders = await prisma.order.findMany({
    where: {
      deletedAt: null,
      ...(status ? { status } : {}),
    },
    include: orderInclude,
    orderBy: { createdAt: 'desc' },
  });
  return { success: true, orders };
}

async function listMyOrders(userId) {
  const orders = await prisma.order.findMany({
    where: { deletedAt: null, userId },
    include: orderInclude,
    orderBy: { createdAt: 'desc' },
  });
  return { success: true, orders };
}

async function getOrder(id) {
  const order = await prisma.order.findFirst({
    where: { id, deletedAt: null },
    include: orderInclude,
  });
  if (!order) {
    return { success: false, message: 'Order not found', statusCode: 404 };
  }
  return { success: true, order };
}

async function createOrder(data) {
  if (!data.items?.length) {
    return { success: false, message: 'At least one order item is required', statusCode: 400 };
  }

  const productIds = data.items.map((i) => i.productId);
  const products = await prisma.product.findMany({
    where: { id: { in: productIds }, deletedAt: null },
    include: { inventory: true },
  });
  if (products.length !== new Set(productIds).size) {
    return { success: false, message: 'One or more products not found', statusCode: 404 };
  }

  const productMap = Object.fromEntries(products.map((p) => [p.id, p]));
  let totalAmount = 0;
  const itemRows = [];

  for (const item of data.items) {
    const product = productMap[item.productId];
    const qty = item.quantity || 1;
    const unitPrice = item.unitPrice ?? product.discountPrice ?? product.price;
    totalAmount += unitPrice * qty;
    itemRows.push({
      productId: product.id,
      productName: product.name,
      size: item.size,
      quantity: qty,
      unitPrice,
    });
  }

  const order = await prisma.order.create({
    data: {
      userId: data.userId || null,
      customerName: data.customerName,
      phone: data.phone,
      city: data.city || null,
      status: OrderStatus.PENDING,
      whatsappNote: data.whatsappNote || null,
      totalAmount,
      currency: data.currency || 'PKR',
      items: { create: itemRows },
    },
    include: orderInclude,
  });

  return { success: true, order };
}

async function updateOrderStatus(id, status) {
  const existing = await prisma.order.findFirst({
    where: { id, deletedAt: null },
    include: { items: true },
  });
  if (!existing) {
    return { success: false, message: 'Order not found', statusCode: 404 };
  }

  if (existing.status === status) {
    return getOrder(id);
  }

  // Decrement stock when moving into CONFIRMED (once)
  if (status === OrderStatus.CONFIRMED && existing.status !== OrderStatus.CONFIRMED) {
    try {
      const order = await prisma.$transaction(async (tx) => {
        for (const item of existing.items) {
          const inv = await tx.productInventory.findUnique({
            where: {
              productId_size: { productId: item.productId, size: item.size },
            },
          });
          if (!inv || inv.quantity < item.quantity) {
            throw Object.assign(
              new Error(
                `Insufficient stock for ${item.productName} size ${item.size}`
              ),
              { statusCode: 409 }
            );
          }
          await tx.productInventory.update({
            where: { id: inv.id },
            data: { quantity: inv.quantity - item.quantity },
          });
        }
        return tx.order.update({
          where: { id },
          data: { status },
          include: orderInclude,
        });
      });
      return { success: true, order };
    } catch (err) {
      return {
        success: false,
        message: err.message || 'Could not confirm order',
        statusCode: err.statusCode || 400,
      };
    }
  }

  // Restoring stock if cancelling a previously confirmed order
  if (
    status === OrderStatus.CANCELLED &&
    existing.status === OrderStatus.CONFIRMED
  ) {
    const order = await prisma.$transaction(async (tx) => {
      for (const item of existing.items) {
        const inv = await tx.productInventory.findUnique({
          where: {
            productId_size: { productId: item.productId, size: item.size },
          },
        });
        if (inv) {
          await tx.productInventory.update({
            where: { id: inv.id },
            data: { quantity: inv.quantity + item.quantity },
          });
        }
      }
      return tx.order.update({
        where: { id },
        data: { status },
        include: orderInclude,
      });
    });
    return { success: true, order };
  }

  const order = await prisma.order.update({
    where: { id },
    data: {
      status,
      whatsappNote: undefined,
    },
    include: orderInclude,
  });
  return { success: true, order };
}

async function updateOrder(id, data) {
  const existing = await prisma.order.findFirst({ where: { id, deletedAt: null } });
  if (!existing) {
    return { success: false, message: 'Order not found', statusCode: 404 };
  }

  if (data.status && data.status !== existing.status) {
    return updateOrderStatus(id, data.status);
  }

  const order = await prisma.order.update({
    where: { id },
    data: {
      customerName: data.customerName,
      phone: data.phone,
      city: data.city,
      whatsappNote: data.whatsappNote,
    },
    include: orderInclude,
  });
  return { success: true, order };
}

module.exports = {
  listOrders,
  listMyOrders,
  getOrder,
  createOrder,
  updateOrder,
  updateOrderStatus,
};
