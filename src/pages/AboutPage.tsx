import React from 'react';
import { motion } from 'framer-motion';
import { Frame } from '../components/Frame';
import { SectionHeader } from '../components/SectionHeader';
import { SectionContainer } from '../components/SectionContainer';
import { Button } from '../components/Button';
import { Divider } from '../components/Divider';

interface AboutPageProps {
  onNavigate: (tab: string) => void;
  onOpenCommission: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({
  onNavigate,
  onOpenCommission,
}) => {
  const bio = [
    'Asma Shala is an Ireland-based fine artist and calligrapher with more than 15 years of artistic experience and 7 years of creating commissioned artwork. Over this time, she has sold more than 140 paintings to collectors in Ireland and internationally, with bespoke commissions reaching homes across six countries.',
    'Her work spans detailed landscape paintings, realism, abstract art, and Arabic calligraphy rather than being limited to a single artistic style. Her practice is motivated by noticing beauty in ordinary moments and creating artwork that invites others to slow down and appreciate their surroundings.',
    'For commissions, she works closely with clients to understand the story, atmosphere, space, or feeling behind a piece. Some commissions begin with a clearly defined vision, while others develop collaboratively through conversations, ideas, and drafts.',
  ];

  const experience = [
    'Over 15 years devoted to traditional oil painting, pigment research, and classical Arabic stroke geometry.',
    '7 dedicated years of bespoke residential and private art commissions for homes in Ireland, the UK, Europe, and beyond.',
    'More than 140 original paintings collected by private patrons, architectural interior designers, and cultural collectors.',
    'Commissions successfully delivered and installed in residential living spaces across 6 countries.',
  ];

  const services = [
    {
      title: 'Landscape & Realism',
      description:
        'Atmospheric landscape paintings capturing memory, light, and nature with layered brushwork designed for contemporary living spaces.',
    },
    {
      title: 'Arabic Calligraphy',
      description:
        'Framed classical and expressive mixed-media calligraphy created with natural earth pigments, archival inks, and 23k gold leaf.',
    },
    {
      title: 'Bespoke Commissions',
      description:
        'Collaborative original artwork tailored in size, color harmony, and mood to anchor private residences and interior design projects.',
    },
  ];

  return (
    <div className="w-full bg-theme-bg text-theme-text pt-4 sm:pt-6 pb-20">
      <SectionContainer>
        {/* Reusable Section Header */}
        <SectionHeader
          label="THE ARTIST BEHIND THE PIECES"
          title="Biography & Philosophy"
        />

        {/* 1. Artist Image & Biography Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-16 items-start">
          {/* Left Column: Portrait Presentation in Museum Frame */}
          <div className="lg:col-span-5 flex justify-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-[420px] lg:max-w-full"
            >
              <Frame className="p-3 md:p-4">
                <div className="relative overflow-hidden w-full bg-white border border-theme-border">
                  <img
                    src="https://res.cloudinary.com/ieyxmxrp/image/upload/v1793014211/shala_gallery/shala_gallery/artist-photo-portrait-landscape.jpg"
                    alt="Asma Shala"
                    className="w-full h-auto object-contain select-none block"
                    loading="eager"
                  />
                </div>
              </Frame>
            </motion.div>
          </div>

          {/* Right Column: Editorial Biography */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-left"
            >
              <span className="text-[9px] font-sans tracking-[0.25em] text-theme-accent uppercase font-semibold block mb-4">
                ARTIST BIOGRAPHY
              </span>
              <div className="font-sans text-xs md:text-sm text-theme-text-muted leading-relaxed space-y-6 tracking-wide">
                {bio.map((para, idx) => (
                  <p key={idx}>{para}</p>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* 2. The Journey / Experience Section */}
        <Divider className="my-20" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-16 items-start text-left">
          <div className="lg:col-span-4">
            <span className="text-[9px] font-sans tracking-[0.25em] text-theme-accent uppercase font-semibold block mb-2">
              THE JOURNEY
            </span>
            <h3 className="font-serif text-2xl md:text-3xl font-light text-theme-text uppercase tracking-wide">
              Creative Record
            </h3>
          </div>
          <div className="lg:col-span-8 font-sans text-xs md:text-sm text-theme-text-muted leading-relaxed space-y-4 tracking-wide">
            {experience.map((exp, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <span className="text-theme-accent text-sm leading-none mt-0.5">&bull;</span>
                <p>{exp}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Services / Disciplines Section */}
        <Divider className="my-20" />
        <div className="text-left">
          <span className="text-[9px] font-sans tracking-[0.25em] text-theme-accent uppercase font-semibold block mb-4">
            DISCIPLINES
          </span>
          <h3 className="font-serif text-2xl md:text-3xl font-light text-theme-text uppercase tracking-wide mb-10">
            Artistic Specializations
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {services.map((service, idx) => (
              <div
                key={idx}
                className="p-6 bg-theme-bg-card border border-theme-border relative hover:border-theme-accent transition-colors duration-300 flex flex-col justify-between shadow-premium"
              >
                <div className="absolute top-0 left-0 w-2 h-[1px] bg-theme-accent" />
                <div className="absolute top-0 left-0 w-[1px] h-2 bg-theme-accent" />
                <div>
                  <h4 className="font-serif text-base font-light text-theme-text tracking-wide uppercase">
                    {service.title}
                  </h4>
                  <p className="font-sans text-[11px] text-theme-text-muted mt-3 leading-relaxed tracking-wider normal-case opacity-85">
                    {service.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Contact & Inquiry CTA Block */}
        <Divider className="my-20" />
        <div className="w-full flex flex-col items-center text-center max-w-2xl mx-auto py-8">
          <span className="text-[10px] font-sans tracking-[0.3em] text-theme-text-muted uppercase font-semibold block mb-4">
            ACQUIRE &bull; COMMISSION
          </span>
          <h2 className="font-serif text-3xl md:text-4xl font-light tracking-wide text-theme-text mb-6 uppercase">
            Curate Into Your Space
          </h2>
          <p className="font-sans text-[11px] tracking-wider text-theme-text-muted max-w-md leading-relaxed mb-8 uppercase">
            Direct acquisitions and bespoke residential commissions are available by contacting Asma directly.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Button
              onClick={onOpenCommission}
              variant="gold"
            >
              COMMISSION PRICE GUIDE
            </Button>
            <Button
              onClick={() => onNavigate('contact')}
              variant="outline"
            >
              CONTACT ROOM
            </Button>
          </div>
        </div>
      </SectionContainer>
    </div>
  );
};
