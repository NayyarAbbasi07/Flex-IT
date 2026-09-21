const { Router } = require('express');
const authRoutes = require('./authRoutes');
const productRoutes = require('./productRoutes');
const brandRoutes = require('./brandRoutes');
const categoryRoutes = require('./categoryRoutes');
const mediaRoutes = require('./mediaRoutes');
const userRoutes = require('./userRoutes');
const statsRoutes = require('./statsRoutes');
const collectionRoutes = require('./collectionRoutes');
const catalogRoutes = require('./catalogRoutes');
const settingsRoutes = require('./settingsRoutes');
const heroRoutes = require('./heroRoutes');
const faqRoutes = require('./faqRoutes');
const testimonialRoutes = require('./testimonialRoutes');
const inquiryRoutes = require('./inquiryRoutes');
const orderRoutes = require('./orderRoutes');

const router = Router();

router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/brands', brandRoutes);
router.use('/categories', categoryRoutes);
router.use('/media', mediaRoutes);
router.use('/users', userRoutes);
router.use('/stats', statsRoutes);
router.use('/collections', collectionRoutes);
router.use('/catalog', catalogRoutes);
router.use('/settings', settingsRoutes);
router.use('/hero', heroRoutes);
router.use('/faqs', faqRoutes);
router.use('/testimonials', testimonialRoutes);
router.use('/inquiries', inquiryRoutes);
router.use('/orders', orderRoutes);

module.exports = router;
