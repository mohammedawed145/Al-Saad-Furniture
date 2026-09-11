import { Seo } from '../components/Seo';
import { useLang } from '../context/LanguageContext';

export function PrivacyPage() {
  const { isAr } = useLang();
  const content = isAr
    ? {
        title: 'سياسة الخصوصية',
        intro: 'نحترم خصوصيتك ونستخدم بياناتك فقط للتواصل معك بشأن استفسارك عن منتجات المعرض.',
        sections: [
          ['البيانات التي نجمعها', 'نجمع الاسم والبريد الإلكتروني ورقم الهاتف والرسالة التي ترسلها عبر نموذج التواصل.'],
          ['استخدام البيانات', 'تُستخدم البيانات للرد على الاستفسار ومتابعة طلبك وتحسين خدمة العملاء فقط.'],
          ['مشاركة البيانات', 'لا نبيع بياناتك الشخصية. قد يطّلع عليها فريق المعرض المسؤول عن خدمة العملاء.'],
          ['التواصل معنا', 'لطلب تعديل أو حذف بياناتك، تواصل معنا من خلال صفحة اتصل بنا.'],
        ],
      }
    : {
        title: 'Privacy Policy',
        intro: 'We use your details only to respond to your showroom enquiry and provide customer service.',
        sections: [
          ['Data we collect', 'We collect the name, email address, phone number, and message you submit through the contact form.'],
          ['How we use it', 'Your information is used only to reply to your enquiry, follow up on your request, and improve customer service.'],
          ['Sharing', 'We do not sell personal information. It may be accessed by showroom staff responsible for customer service.'],
          ['Contact us', 'To amend or remove your information, contact us through the Contact Us page.'],
        ],
      };

  return <div className="page-wrap max-w-3xl py-16"><Seo title={content.title} description={content.intro} /><h1 className="font-display text-5xl">{content.title}</h1><p className="mt-6 text-lg leading-relaxed text-stone">{content.intro}</p><div className="mt-10 space-y-8">{content.sections.map(([heading, text]) => <section key={heading}><h2 className="font-display text-3xl">{heading}</h2><p className="mt-3 leading-relaxed text-stone">{text}</p></section>)}</div></div>;
}
