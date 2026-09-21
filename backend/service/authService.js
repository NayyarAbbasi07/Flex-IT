const bcrypt = require('bcryptjs');
const { prisma } = require('./prisma');
const { signToken } = require('../utils/jwt');
const config = require('../config');

async function loginUser(email, password, remember) {
  const user = await prisma.user.findFirst({
    where: { email: email.toLowerCase(), deletedAt: null },
  });
  if (!user) {
    return { success: false, message: 'Invalid email or password', statusCode: 401 };
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    return { success: false, message: 'Invalid email or password', statusCode: 401 };
  }

  const payload = {
    id: user.id,
    email: user.email,
    role: user.role,
  };
  const token = signToken(payload, remember);

  return {
    success: true,
    auth: {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    },
  };
}

async function getUserById(id) {
  const user = await prisma.user.findFirst({
    where: { id, deletedAt: null },
    select: { id: true, email: true, name: true, role: true },
  });
  if (!user) {
    return { success: false, message: 'Unauthorized', statusCode: 401 };
  }
  return { success: true, user };
}

async function changePassword(userId, currentPassword, newPassword) {
  const user = await prisma.user.findFirst({
    where: { id: userId, deletedAt: null },
  });
  if (!user) {
    return { success: false, message: 'User not found', statusCode: 404 };
  }

  const valid = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!valid) {
    return { success: false, message: 'Current password is incorrect', statusCode: 400 };
  }

  const passwordHash = await bcrypt.hash(newPassword, config.auth.bcryptRounds);
  await prisma.user.update({
    where: { id: userId },
    data: { passwordHash },
  });

  return { success: true };
}

module.exports = {
  loginUser,
  getUserById,
  changePassword,
};
