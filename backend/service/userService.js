const bcrypt = require('bcryptjs');
const { prisma } = require('./prisma');
const config = require('../config');
const { Role } = require('../common/enumFunction');

const userSelect = {
  id: true,
  email: true,
  name: true,
  role: true,
  createdAt: true,
  updatedAt: true,
};

async function listUsers(role) {
  const users = await prisma.user.findMany({
    where: {
      deletedAt: null,
      ...(role ? { role } : {}),
    },
    select: userSelect,
    orderBy: { createdAt: 'desc' },
  });
  return { success: true, users };
}

async function createUser({ email, password, name, role }) {
  const normalizedEmail = email.toLowerCase().trim();
  const existing = await prisma.user.findFirst({
    where: { email: normalizedEmail, deletedAt: null },
  });
  if (existing) {
    return { success: false, message: 'Email already in use', statusCode: 409 };
  }

  const passwordHash = await bcrypt.hash(password, config.auth.bcryptRounds);
  const user = await prisma.user.create({
    data: {
      email: normalizedEmail,
      name: name || null,
      passwordHash,
      role: role || Role.CUSTOMER,
    },
    select: userSelect,
  });

  return { success: true, user };
}

async function updateUser(id, data) {
  const existing = await prisma.user.findFirst({ where: { id, deletedAt: null } });
  if (!existing) {
    return { success: false, message: 'User not found', statusCode: 404 };
  }

  if (data.email && data.email.toLowerCase() !== existing.email) {
    const taken = await prisma.user.findFirst({
      where: {
        email: data.email.toLowerCase(),
        deletedAt: null,
        NOT: { id },
      },
    });
    if (taken) {
      return { success: false, message: 'Email already in use', statusCode: 409 };
    }
  }

  const updateData = {};
  if (data.email !== undefined) updateData.email = data.email.toLowerCase().trim();
  if (data.name !== undefined) updateData.name = data.name || null;
  if (data.role !== undefined) updateData.role = data.role;
  if (data.password) {
    updateData.passwordHash = await bcrypt.hash(data.password, config.auth.bcryptRounds);
  }

  const user = await prisma.user.update({
    where: { id },
    data: updateData,
    select: userSelect,
  });

  return { success: true, user };
}

async function deleteUser(id, actorId) {
  if (id === actorId) {
    return { success: false, message: 'You cannot delete your own account', statusCode: 400 };
  }

  const existing = await prisma.user.findFirst({ where: { id, deletedAt: null } });
  if (!existing) {
    return { success: false, message: 'User not found', statusCode: 404 };
  }

  await prisma.user.update({
    where: { id },
    data: { deletedAt: new Date() },
  });

  return { success: true, user: { id } };
}

async function registerCustomer({ email, password, name }) {
  return createUser({
    email,
    password,
    name,
    role: Role.CUSTOMER,
  });
}

module.exports = {
  listUsers,
  createUser,
  updateUser,
  deleteUser,
  registerCustomer,
};
