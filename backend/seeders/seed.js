const config = require("../config");
const { PrismaClient, ProductStatus, Gender, ConditionGrade } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const { Role } = require("../common/enumFunction");
const prisma = new PrismaClient();
const brands = [
    "Nike",
    "Adidas",
    "New Balance",
    "Puma",
    "ASICS",
    "Converse",
    "Vans",
    "HOKA",
];
const categories = [
    "Sneakers",
    "Running",
    "Lifestyle",
    "Basketball",
    "Casual",
    "Football",
    "Hiking",
];
function slugify(text) {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_-]+/g, "-")
        .replace(/^-+|-+$/g, "");
}
const conditionMap = {
    new: "A_PLUS",
    "like-new": "A_PLUS",
    excellent: "A",
    good: "B_PLUS",
    fair: "B",
};
async function main() {
    const passwordHash = await bcrypt.hash(config.admin.password, config.auth.bcryptRounds);
    await prisma.user.upsert({
        where: { email: "admin@flexit.store" },
        update: { passwordHash, role: Role.ADMIN },
        create: {
            email: "admin@flexit.store",
            name: "Flex it Admin",
            passwordHash,
            role: Role.ADMIN,
        },
    });
    const brandRecords = [];
    for (const [i, name] of brands.entries()) {
        brandRecords.push(await prisma.brand.upsert({
            where: { slug: slugify(name) },
            update: { name, featured: i < 5, sortOrder: i },
            create: {
                name,
                slug: slugify(name),
                featured: i < 5,
                sortOrder: i,
                description: `${name} curated collection`,
            },
        }));
    }
    const categoryRecords = [];
    for (const [i, name] of categories.entries()) {
        categoryRecords.push(await prisma.category.upsert({
            where: { slug: slugify(name) },
            update: { name, sortOrder: i, enabled: true },
            create: {
                name,
                slug: slugify(name),
                sortOrder: i,
                enabled: true,
            },
        }));
    }
    const brandByName = Object.fromEntries(brandRecords.map((b) => [b.name, b]));
    const sneakers = categoryRecords.find((c) => c.slug === "sneakers");
    const products = [
        {
            name: "Air Force 1 '07",
            brand: "Nike",
            slug: "nike-air-force-1-white",
            sku: "NIK-AF1-001",
            price: 24900,
            discountPrice: 18900,
            condition: "excellent",
            color: "White / White",
            featured: true,
            sizes: { "40": 2, "41": 3, "42": 1, "43": 2 },
            images: ["/products/af1-1.jpg", "/products/af1-2.jpg", "/products/af1-3.jpg"],
            description: "A clean classic. Premium imported Air Force 1 with crisp leather uppers.",
        },
        {
            name: "Samba OG",
            brand: "Adidas",
            slug: "adidas-samba-og-black",
            sku: "ADI-SAM-001",
            price: 16500,
            condition: "like-new",
            color: "Core Black / Cloud White",
            featured: true,
            sizes: { "39": 1, "40": 2, "41": 2, "42": 3, "44": 1 },
            images: ["/products/samba-1.jpg", "/products/samba-2.jpg"],
            description: "The iconic Samba OG in black.",
        },
        {
            name: "550 White Green",
            brand: "New Balance",
            slug: "new-balance-550-white-green",
            sku: "NB-550-001",
            price: 28000,
            discountPrice: 22000,
            condition: "excellent",
            color: "White / Green",
            featured: true,
            sizes: { "40": 1, "41": 2, "42": 2, "43": 1, "44": 1 },
            images: ["/products/nb550-1.jpg", "/products/nb550-2.jpg"],
            description: "Court-inspired New Balance 550.",
        },
        {
            name: "Air Jordan 1 Retro High",
            brand: "Nike",
            slug: "jordan-1-retro-high-chicago",
            sku: "NIK-AJ1-001",
            price: 45000,
            condition: "good",
            color: "Chicago Red / White / Black",
            featured: true,
            sizes: { "41": 1, "42": 1, "43": 0 },
            images: ["/products/jordan-1.jpg", "/products/jordan-2.jpg"],
            description: "Legendary AJ1 energy.",
        },
        {
            name: "Suede Classic XXI",
            brand: "Puma",
            slug: "puma-suede-classic-xxi",
            sku: "PUM-SUE-001",
            price: 12500,
            condition: "excellent",
            color: "Peacoat / White",
            featured: false,
            sizes: { "40": 2, "41": 2, "42": 2, "43": 1, "44": 1, "45": 1 },
            images: ["/products/puma-1.jpg", "/products/puma-2.jpg"],
            description: "Soft suede upper, Formstrip heritage.",
        },
        {
            name: "GEL-Kayano 14",
            brand: "ASICS",
            slug: "asics-gel-kayano-14",
            sku: "ASI-KAY-001",
            price: 27500,
            condition: "like-new",
            color: "Cream / Pure Silver",
            featured: true,
            sizes: { "40": 1, "41": 2, "42": 2, "43": 1 },
            images: ["/products/asics-1.jpg", "/products/asics-2.jpg"],
            description: "GEL-Kayano 14 with layered mesh.",
        },
        {
            name: "Chuck 70 High",
            brand: "Converse",
            slug: "converse-chuck-70-hi",
            sku: "CON-CH70-001",
            price: 11000,
            condition: "excellent",
            color: "Black / Egret / Egret",
            featured: false,
            sizes: { "39": 1, "40": 2, "41": 2, "42": 1, "43": 1 },
            images: ["/products/converse-1.jpg"],
            description: "Elevated Chuck 70 construction.",
        },
        {
            name: "Old Skool",
            brand: "Vans",
            slug: "vans-old-skool-black",
            sku: "VAN-OS-001",
            price: 9800,
            condition: "good",
            color: "Black / White",
            featured: false,
            sizes: { "40": 1, "41": 2, "42": 2, "43": 1, "44": 1 },
            images: ["/products/vans-1.jpg"],
            description: "The sidewall stripe icon.",
        },
        {
            name: "Clifton 9",
            brand: "HOKA",
            slug: "hoka-clifton-9",
            sku: "HOK-CLI-001",
            price: 32000,
            condition: "like-new",
            color: "Black / Black",
            featured: true,
            sizes: { "41": 1, "42": 2, "43": 1, "44": 1 },
            images: ["/products/hoka-1.jpg", "/products/hoka-2.jpg"],
            description: "Cloud-soft cushioning in a sleek silhouette.",
        },
        {
            name: "Dunk Low Retro",
            brand: "Nike",
            slug: "nike-dunk-low-panda",
            sku: "NIK-DNK-001",
            price: 24000,
            condition: "excellent",
            color: "White / Black",
            featured: false,
            sizes: { "40": 0, "41": 1, "42": 0 },
            images: ["/products/dunk-1.jpg", "/products/af1-2.jpg"],
            description: "The Panda Dunk — clean contrast.",
        },
        {
            name: "Gazelle Bold",
            brand: "Adidas",
            slug: "adidas-gazelle-bold",
            sku: "ADI-GAZ-001",
            price: 19500,
            condition: "like-new",
            color: "Pink Spark / Cloud White",
            featured: false,
            sizes: { "38": 1, "39": 1, "40": 2, "41": 1 },
            images: ["/products/gazelle-1.jpg"],
            description: "Platform Gazelle energy.",
        },
        {
            name: "2002R",
            brand: "New Balance",
            slug: "new-balance-2002r",
            sku: "NB-2002-001",
            price: 28500,
            condition: "excellent",
            color: "Grey / Silver",
            featured: false,
            sizes: { "41": 0, "42": 0, "43": 0, "44": 0 },
            images: ["/products/nb2002-1.jpg"],
            description: "Technical mesh and stability-inspired design.",
        },
    ];
    for (const item of products) {
        const brand = brandByName[item.brand];
        await prisma.product.upsert({
            where: { slug: item.slug },
            update: {
                name: item.name,
                price: item.price,
                discountPrice: item.discountPrice ?? null,
                status: ProductStatus.PUBLISHED,
                featured: item.featured,
                newArrival: true,
            },
            create: {
                name: item.name,
                slug: item.slug,
                sku: item.sku,
                description: item.description,
                brandId: brand.id,
                categoryId: sneakers.id,
                gender: Gender.UNISEX,
                shoeType: "Sneakers",
                condition: conditionMap[item.condition] || ConditionGrade.A,
                originalBrand: item.brand,
                importedFrom: "Imported thrift",
                color: item.color,
                price: item.price,
                discountPrice: item.discountPrice ?? null,
                featured: item.featured,
                newArrival: true,
                status: ProductStatus.PUBLISHED,
                tags: [item.brand.toLowerCase(), "sneakers"],
                images: {
                    create: item.images.map((url, i) => ({
                        url,
                        alt: item.name,
                        sortOrder: i,
                        isPrimary: i === 0,
                    })),
                },
                inventory: {
                    create: Object.entries(item.sizes).map(([size, quantity]) => ({
                        size,
                        quantity,
                        lowStockAt: 2,
                    })),
                },
            },
        });
    }
    await prisma.storeSetting.upsert({
        where: { key: "whatsappNumber" },
        update: { value: "923330215663" },
        create: { key: "whatsappNumber", value: "923330215663" },
    });
    await prisma.storeSetting.upsert({
        where: { key: "phone" },
        update: { value: "0333 0215663" },
        create: { key: "phone", value: "0333 0215663" },
    });
    await prisma.storeSetting.upsert({
        where: { key: "brandName" },
        update: { value: "Flex it!" },
        create: { key: "brandName", value: "Flex it!" },
    });
    await prisma.heroSection.create({
        data: {
            heading: "Curated Fashion.",
            subheading: "",
            description: "Imported Premium Thrift Sneakers Curated For Every Style.",
            imageUrls: ["/products/hero-stage.jpg", "/products/af1-1.jpg", "/products/jordan-1.jpg"],
        },
    }).catch(() => undefined);

    const faqCount = await prisma.faq.count({ where: { deletedAt: null } });
    if (faqCount === 0) {
        await prisma.faq.createMany({
            data: [
                {
                    question: "Are these sneakers authentic?",
                    answer: "Yes. Every pair is curated thrift / imported stock. Condition is graded and shown on the product page.",
                    sortOrder: 1,
                    enabled: true,
                },
                {
                    question: "How do I place an order?",
                    answer: "Message us on WhatsApp from the product page. We confirm size, price (PKR), and delivery details there.",
                    sortOrder: 2,
                    enabled: true,
                },
                {
                    question: "Do you deliver across Pakistan?",
                    answer: "Yes — nationwide delivery. Shipping charges are confirmed on WhatsApp before dispatch.",
                    sortOrder: 3,
                    enabled: true,
                },
            ],
        });
    }

    const testimonialCount = await prisma.testimonial.count({ where: { deletedAt: null } });
    if (testimonialCount === 0) {
        await prisma.testimonial.createMany({
            data: [
                {
                    name: "Ayesha K.",
                    rating: 5,
                    comment: "Got my Air Force 1s in perfect condition. WhatsApp ordering was easy.",
                    productName: "Nike Air Force 1",
                    location: "Lahore",
                    sortOrder: 1,
                    enabled: true,
                },
                {
                    name: "Hassan R.",
                    rating: 5,
                    comment: "Honest grading and fast replies. Will order again.",
                    productName: "Adidas Samba",
                    location: "Karachi",
                    sortOrder: 2,
                    enabled: true,
                },
            ],
        });
    }

    console.log("Seed complete.");
    console.log("Admin login: admin@flexit.store");
    console.log("Password:", config.admin.password);
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
