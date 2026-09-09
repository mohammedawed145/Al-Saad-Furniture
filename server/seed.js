import bcrypt from 'bcryptjs';
import { connectDb } from './config/db.js';
import { config } from './config/env.js';
import { Admin } from './models/Admin.js';
import { Category } from './models/Category.js';
import { Product } from './models/Product.js';
import { Branch } from './models/Branch.js';

const DEMO_IMAGES = {
  bedroom: [
    'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1600&q=80',
  ],
  sofa: [
    'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1493666438817-866a91353ca9?auto=format&fit=crop&w=1600&q=80',
  ],
  dining: [
    'https://images.unsplash.com/photo-1617806118233-18e1de3d13c1?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1604578762246-41134e37f9cc?auto=format&fit=crop&w=1600&q=80',
  ],
  wardrobe: [
    'https://images.unsplash.com/photo-1558997519-85ccfe99f24a?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=1600&q=80',
  ],
  tv: [
    'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=1600&q=80',
  ],
  chairs: [
    'https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1501045661006-fcebb0d1d3e4?auto=format&fit=crop&w=1600&q=80',
  ],
  corner: [
    'https://images.unsplash.com/photo-1567016432779-094069958ea5?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1540574163026-643ea20ade25?auto=format&fit=crop&w=1600&q=80',
  ],
  office: [
    'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1593062096033-9a26b09da705?auto=format&fit=crop&w=1600&q=80',
  ],
  table: [
    'https://images.unsplash.com/photo-1530018607912-eff2daa1bac4?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1611269154421-4e2725695f9d?auto=format&fit=crop&w=1600&q=80',
  ],
};

async function seed() {
  await connectDb();

  const passwordHash = await bcrypt.hash(config.adminPassword, 12);
  await Admin.findOneAndUpdate(
    { email: config.adminEmail.toLowerCase() },
    { name: 'Showroom Admin', email: config.adminEmail.toLowerCase(), passwordHash },
    { upsert: true, new: true }
  );

  await Product.deleteMany({});
  await Category.deleteMany({});
  await Branch.deleteMany({});
  try {
    await Product.collection.dropIndex('slug_1');
  } catch (error) {
    if (error.codeName !== 'IndexNotFound') throw error;
  }

  const categoryDocs = await Category.insertMany([
    { slug: 'antiques', nameEn: 'Antiques', nameAr: 'التحف', image: DEMO_IMAGES.tv[0] },
    { slug: 'bedroom', nameEn: 'Bedroom', nameAr: 'غرفة النوم', image: DEMO_IMAGES.bedroom[0] },
    { slug: 'chairs', nameEn: 'Chairs', nameAr: 'الكراسي', image: DEMO_IMAGES.chairs[0] },
    { slug: 'dining-room', nameEn: 'Dinning room', nameAr: 'غرفة الطعام', image: DEMO_IMAGES.dining[0] },
    { slug: 'salon', nameEn: 'Salon', nameAr: 'الصالون', image: DEMO_IMAGES.sofa[0] },
    { slug: 'seating-room', nameEn: 'Seating room', nameAr: 'غرفة الجلوس', image: DEMO_IMAGES.corner[0] },
  ]);

  const bySlug = Object.fromEntries(categoryDocs.map((item) => [item.slug, item._id]));

  await Product.insertMany([
    {
      nameEn: 'Modern Bedroom Set',
      nameAr: 'طقم غرفة نوم عصرية',
      category: bySlug.bedroom,
      descriptionEn: 'Elegant modern bedroom furniture designed with a combination of comfort and style. A calm, refined composition for a restful space.',
      descriptionAr: 'أثاث غرفة نوم عصرية أنيق يجمع بين الراحة والأسلوب الراقي، ليمنح غرفتك هدوءًا وتناسقًا بصريًا.',
      featuresEn: ['High-quality materials', 'Modern design', 'Multiple finish options', 'Soft storage details'],
      featuresAr: ['خامات عالية الجودة', 'تصميم عصري', 'خيارات تشطيب متعددة', 'تفاصيل تخزين ناعمة'],
      images: DEMO_IMAGES.bedroom,
      featured: true,
    },
    {
      nameEn: 'Luxury Sofa',
      nameAr: 'أريكة فاخرة',
      category: bySlug.salon,
      descriptionEn: 'A generous sofa with deep seating and a quiet, tailored silhouette. Designed to anchor a living room with comfort and presence.',
      descriptionAr: 'أريكة واسعة بمقاعد عميقة وخطوط هادئة مصممة لتكون محور غرفة المعيشة براحة وحضور أنيق.',
      featuresEn: ['Deep seating', 'Durable upholstery', 'Refined stitching', 'Showroom display piece'],
      featuresAr: ['مقاعد عميقة', 'تنجيد متين', 'خياطة دقيقة', 'قطعة عرض في المعرض'],
      images: DEMO_IMAGES.sofa,
      featured: true,
    },
    {
      nameEn: 'Modern Dining Table',
      nameAr: 'طاولة طعام عصرية',
      category: bySlug['dining-room'],
      descriptionEn: 'A sculptural dining table with a warm wood presence, suited for gatherings and everyday meals alike.',
      descriptionAr: 'طاولة طعام بنسب متوازنة وحضور خشبي دافئ، مناسبة للتجمعات وللوجبات اليومية.',
      featuresEn: ['Solid wood character', 'Generous surface', 'Timeless proportions', 'Pairs with dining chairs'],
      featuresAr: ['طابع خشبي أصيل', 'سطح واسع', 'نسب خالدة', 'تتناسق مع كراسي الطعام'],
      images: DEMO_IMAGES.dining,
      featured: true,
    },
    {
      nameEn: 'Classic Wardrobe',
      nameAr: 'خزانة كلاسيكية',
      category: bySlug.bedroom,
      descriptionEn: 'A wardrobe with calm paneling and practical interior organization, designed for daily ease and a polished bedroom look.',
      descriptionAr: 'خزانة بألواح هادئة وتنظيم داخلي عملي، مصممة للاستخدام اليومي ولمظهر غرفة نوم متناسق.',
      featuresEn: ['Ample hanging space', 'Interior shelves', 'Classic detailing', 'Durable hardware'],
      featuresAr: ['مساحة تعليق واسعة', 'أرفف داخلية', 'تفاصيل كلاسيكية', 'مقابض متينة'],
      images: DEMO_IMAGES.wardrobe,
      featured: false,
    },
    {
      nameEn: 'Modern TV Unit',
      nameAr: 'وحدة تلفاز عصرية',
      category: bySlug.salon,
      descriptionEn: 'A low media unit with clean lines and discreet storage, made to keep the living room uncluttered and composed.',
      descriptionAr: 'وحدة تلفاز منخفضة بخطوط نظيفة وتخزين هادئ، تحافظ على ترتيب غرفة المعيشة وأناقتها.',
      featuresEn: ['Cable-friendly design', 'Closed storage', 'Low profile', 'Warm finish'],
      featuresAr: ['تصميم يراعي الكابلات', 'تخزين مغلق', 'ارتفاع منخفض', 'تشطيب دافئ'],
      images: DEMO_IMAGES.tv,
      featured: true,
    },
    {
      nameEn: 'Dining Chairs',
      nameAr: 'كراسي طعام',
      category: bySlug.chairs,
      descriptionEn: 'Dining chairs with a light, architectural frame and a comfortable seat, intended to complement a modern dining table.',
      descriptionAr: 'كراسي طعام بهيكل خفيف ومقعد مريح، مصممة لتكمل طاولة الطعام العصرية.',
      featuresEn: ['Comfortable seat', 'Stable frame', 'Easy to pair', 'Showroom set available'],
      featuresAr: ['مقعد مريح', 'هيكل ثابت', 'سهولة التنسيق', 'طقم متوفر في المعرض'],
      images: DEMO_IMAGES.chairs,
      featured: false,
    },
    {
      nameEn: 'Corner Sofa',
      nameAr: 'أريكة ركنية',
      category: bySlug['seating-room'],
      descriptionEn: 'A spacious corner sofa that shapes a living room around conversation, rest, and a generous sense of hospitality.',
      descriptionAr: 'أريكة ركنية واسعة تشكّل غرفة المعيشة حول الحوار والراحة وحسن الضيافة.',
      featuresEn: ['L-shaped layout', 'Soft cushions', 'Family-sized seating', 'Neutral palette'],
      featuresAr: ['تخطيط ركني', 'وسائد ناعمة', 'مقاعد واسعة للعائلة', 'ألوان محايدة'],
      images: DEMO_IMAGES.corner,
      featured: true,
    },
    {
      nameEn: 'Office Desk',
      nameAr: 'مكتب عمل',
      category: bySlug['seating-room'],
      descriptionEn: 'A composed office desk with a quiet work surface and considered storage, suited for a home study or professional office.',
      descriptionAr: 'مكتب عمل بسطح هادئ وتخزين مدروس، مناسب لغرفة دراسة منزلية أو مكتب مهني.',
      featuresEn: ['Ample work surface', 'Drawer storage', 'Calm proportions', 'Durable finish'],
      featuresAr: ['سطح عمل واسع', 'أدراج للتخزين', 'نسب متوازنة', 'تشطيب متين'],
      images: DEMO_IMAGES.office,
      featured: false,
    },
    {
      nameEn: 'Coffee Table',
      nameAr: 'طاولة قهوة',
      category: bySlug.antiques,
      descriptionEn: 'A low coffee table with a warm wood top and a light visual weight, designed to sit naturally with sofas and lounge chairs.',
      descriptionAr: 'طاولة قهوة منخفضة بسطح خشبي دافئ وحضور خفيف، تتناسق مع الأرائك وكراسي الاسترخاء.',
      featuresEn: ['Warm wood surface', 'Low profile', 'Living room scale', 'Easy to style'],
      featuresAr: ['سطح خشبي دافئ', 'ارتفاع منخفض', 'مقاس مناسب لغرفة المعيشة', 'سهلة التنسيق'],
      images: DEMO_IMAGES.table,
      featured: false,
    },
  ]);

  await Branch.insertMany([
    {
      nameEn: 'Al-Saad Furniture — Main Branch',
      nameAr: 'معرض السعد للأثاث — الفرع الرئيسي',
      addressEn: 'Damietta, Dumyat, Egypt',
      addressAr: 'دمياط، العدلية، محافظة دمياط',
      phone: '+201064990995',
      whatsapp: '201064990995',
      email: 'asaadfurniture19@gmail.com',
      openingHoursEn: 'Open 24 hours',
      openingHoursAr: 'مفتوح دائمًا',
      googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Damietta%2C%20Dumyat%2C%20Egypt',
    },
  ]);

  console.log('Seed complete.');
  console.log(`Admin email: ${config.adminEmail}`);
  console.log('Demo products, categories, and placeholder branches were reset.');
  process.exit(0);
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
