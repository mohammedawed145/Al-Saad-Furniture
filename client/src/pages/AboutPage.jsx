import { Seo } from '../components/Seo';
import { Reveal } from '../components/Motion';
import { useLang } from '../context/LanguageContext';

export function AboutPage() {
  const { t } = useLang();
  const blocks = [
    [t.about.storyTitle, t.about.story],
    [t.about.visionTitle, t.about.vision],
    [t.about.missionTitle, t.about.mission],
    [t.about.qualityTitle, t.about.quality],
    [t.about.serviceTitle, t.about.service],
  ];

  return (
    <div className="page-wrap py-16">
      <Seo title={t.nav.about} description={t.about.intro} />
      <Reveal>
        <p className="text-xs uppercase tracking-[0.24em] text-gold">{t.nav.about}</p>
        <h1 className="mt-3 max-w-3xl font-display text-5xl">{t.about.title}</h1>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-stone">{t.about.intro}</p>
      </Reveal>
      <div className="mt-16 grid gap-6 md:grid-cols-2">
        {blocks.map(([title, text], index) => (
          <Reveal key={title} delay={index * 0.05} className="rounded-3xl bg-white p-8">
            <h2 className="font-display text-3xl">{title}</h2>
            <p className="mt-4 leading-relaxed text-stone">{text}</p>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
