const { mkdir, writeFile } = require('fs/promises');
const path = require('path');
const { prisma } = require('./prisma');
const config = require('../config');

const ALLOWED = new Set(config.uploads.allowedMimeTypes);
const MAX_BYTES = config.uploads.maxFileSize;

async function listMedia(q) {
  const media = await prisma.mediaAsset.findMany({
    where: {
      deletedAt: null,
      ...(q
        ? {
            OR: [
              { filename: { contains: q, mode: 'insensitive' } },
              { alt: { contains: q, mode: 'insensitive' } },
            ],
          }
        : {}),
    },
    orderBy: { createdAt: 'desc' },
    take: config.uploads.mediaListLimit,
  });
  return { success: true, media };
}

async function uploadMedia(opts) {
  if (!ALLOWED.has(opts.mimeType)) {
    return { success: false, message: 'Only JPG, PNG, WEBP allowed', statusCode: 400 };
  }
  if (opts.size > MAX_BYTES) {
    return { success: false, message: 'File too large (max 5MB)', statusCode: 400 };
  }

  const uploadsRoot = config.uploads.dir;
  const folder = opts.folder || uploadsRoot;
  const ext =
    opts.mimeType === 'image/png' ? 'png' : opts.mimeType === 'image/webp' ? 'webp' : 'jpg';
  const safeName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const dir =
    folder === uploadsRoot
      ? path.join(process.cwd(), uploadsRoot)
      : path.join(process.cwd(), uploadsRoot, folder);
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, safeName), opts.buffer);

  const url = `/${uploadsRoot}/${safeName}`;
  const asset = await prisma.mediaAsset.create({
    data: {
      filename: opts.originalName || safeName,
      url,
      mimeType: opts.mimeType,
      size: opts.size,
      folder: uploadsRoot,
      alt: opts.alt || '',
    },
  });

  return { success: true, asset };
}

async function deleteMedia(id) {
  try {
    await prisma.mediaAsset.update({ where: { id }, data: { deletedAt: new Date() } });
    return { success: true, media: { id } };
  } catch {
    return { success: false, message: 'Media not found', statusCode: 404 };
  }
}

module.exports = {
  listMedia,
  uploadMedia,
  deleteMedia,
};
