import React from 'react';
import { SectionContainer } from '../components/SectionContainer';
import { PriceGuideTable } from '../components/PriceGuideTable';
import { CommissionProcessSteps } from '../components/CommissionProcessSteps';
import { Divider } from '../components/Divider';
import { Button } from '../components/Button';

interface CommissionsPageProps {
  onDiscussCommission: () => void;
}

export const CommissionsPage: React.FC<CommissionsPageProps> = ({
  onDiscussCommission,
}) => {
  return (
    <div className="w-full bg-theme-bg text-theme-text pt-6 sm:pt-8 pb-20">
      <SectionContainer>
        {/* The 5-Step Commission Process */}
        <CommissionProcessSteps />

        {/* Price Guide Table */}
        <Divider className="my-16 md:my-20" />
        <PriceGuideTable />

        {/* Interior Designer & Trade Collaboration */}
        <Divider className="my-16 md:my-20" />
        <div className="p-8 sm:p-12 bg-theme-bg-surface border border-theme-border relative shadow-premium text-left">
          <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-theme-accent" />
          <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-theme-accent" />

          <div className="pb-6 border-b border-theme-border mb-6">
            <span className="text-[9px] font-sans tracking-[0.25em] text-theme-accent uppercase font-semibold">
              ARCHITECTURAL &bull; INTERIORS
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-light uppercase tracking-wide text-theme-text mt-1">
              Collaborating with Interior Designers
            </h3>
          </div>

          <p className="font-sans text-xs md:text-sm text-theme-text-muted opacity-80 leading-relaxed uppercase tracking-wider">
            Asma collaborates with residential interior architects and designers in Ireland and internationally, assisting with color-palette coordination, scale proportioning for architectural floor plans, and custom solid hardwood framing.
          </p>
        </div>

        {/* Single Primary Commission Inquiry CTA */}
        <Divider className="my-16 md:my-20" />
        <div className="p-8 sm:p-12 md:p-16 bg-theme-bg-surface border border-theme-border text-center relative shadow-premium">
          <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-theme-accent" />
          <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-theme-accent" />

          <span className="text-[10px] font-sans tracking-[0.35em] text-theme-accent uppercase font-semibold block mb-3">
            START YOUR BESPOKE PIECE
          </span>
          <h3 className="font-serif text-2xl sm:text-3xl md:text-4xl font-light uppercase tracking-widest text-theme-text mb-4">
            Discuss Your Commission
          </h3>
          <p className="font-sans text-xs md:text-sm text-theme-text-muted opacity-85 leading-relaxed uppercase tracking-wider max-w-2xl mx-auto mb-8">
            Whether for a residential interior, architectural project, or meaningful personal space, reach out to discuss your ideas, required dimensions, and creative direction.
          </p>
          <Button
            onClick={onDiscussCommission}
            variant="gold"
            className="px-8 py-3.5 text-xs tracking-[0.25em]"
          >
            DISCUSS YOUR COMMISSION
          </Button>
        </div>
      </SectionContainer>
    </div>
  );
};
