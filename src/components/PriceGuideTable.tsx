import React from 'react';
import { COMMISSION_PRICE_TIERS } from '../data/pricing';
import { Info } from 'lucide-react';

interface PriceGuideTableProps {
  onDiscussCommission?: () => void;
}

export const PriceGuideTable: React.FC<PriceGuideTableProps> = () => {
  return (
    <div className="w-full">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
        <span className="text-[10px] font-sans tracking-[0.35em] text-theme-accent uppercase font-semibold block mb-3">
          TRANSPARENT ART INVESTMENT
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light uppercase tracking-widest text-theme-text mb-4">
          Commission Price Guide
        </h2>
        <p className="font-sans text-xs md:text-sm text-theme-text-muted opacity-80 leading-relaxed uppercase tracking-wider">
          Approximate guide prices for bespoke paintings. Each piece is developed around your space and story.
        </p>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-hidden bg-theme-bg-card border border-theme-border shadow-premium transition-colors duration-500">
        <table className="w-full text-left border-collapse" aria-label="Commission Price Guide">
          <thead>
            <tr className="bg-theme-bg-surface border-b border-theme-border">
              <th scope="col" className="py-4 px-6 font-sans text-[10px] tracking-[0.25em] uppercase font-semibold text-theme-text-muted">
                Format / Size
              </th>
              <th scope="col" className="py-4 px-6 font-sans text-[10px] tracking-[0.25em] uppercase font-semibold text-theme-text-muted">
                Dimensions
              </th>
              <th scope="col" className="py-4 px-6 font-sans text-[10px] tracking-[0.25em] uppercase font-semibold text-theme-text-muted">
                Ideal Setting
              </th>
              <th scope="col" className="py-4 px-6 font-sans text-[10px] tracking-[0.25em] uppercase font-semibold text-theme-accent text-right">
                Guide Investment
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-theme-border font-sans text-xs">
            {COMMISSION_PRICE_TIERS.map((tier) => (
              <tr key={tier.sizeCode} className="hover:bg-theme-bg-surface/50 transition-colors">
                <td className="py-4 px-6 font-serif text-base font-light text-theme-text uppercase tracking-wide">
                  {tier.sizeCode}
                </td>
                <td className="py-4 px-6 text-theme-text-muted font-mono text-xs">
                  {tier.dimensions}
                </td>
                <td className="py-4 px-6 text-theme-text-muted opacity-75">
                  {tier.suitableFor}
                </td>
                <td className="py-4 px-6 text-right font-serif text-lg font-light text-theme-accent tracking-wide">
                  {tier.price}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card Presentation */}
      <div className="md:hidden space-y-3">
        {COMMISSION_PRICE_TIERS.map((tier) => (
          <div
            key={tier.sizeCode}
            className="p-4 bg-theme-bg-card border border-theme-border flex justify-between items-center"
          >
            <div>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="font-serif text-lg font-light text-theme-text uppercase tracking-wide">
                  {tier.sizeCode}
                </span>
                <span className="text-[10px] font-mono text-theme-text-muted opacity-75">
                  ({tier.dimensions})
                </span>
              </div>
              <p className="text-[10px] font-sans text-theme-text-muted opacity-70 max-w-[200px]">
                {tier.suitableFor}
              </p>
            </div>
            <div className="text-right pl-3 border-l border-theme-border">
              <span className="text-[8px] uppercase tracking-widest text-theme-text-muted block">Guide</span>
              <span className="font-serif text-lg font-light text-theme-accent">
                {tier.price}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Pricing Clarification Box */}
      <div className="mt-8 p-6 bg-theme-bg-card border border-theme-border relative shadow-premium flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        {/* Frame corner accents */}
        <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t border-l border-theme-accent" />
        <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b border-r border-theme-accent" />

        <div className="flex items-start gap-4">
          <div className="p-2 rounded-full border border-theme-border text-theme-accent shrink-0">
            <Info size={15} />
          </div>
          <div className="font-sans text-xs text-theme-text-muted leading-relaxed">
            <p className="font-medium text-theme-text uppercase tracking-wider text-[11px] mb-1">
              Pricing depends on size and detail. Professional framing is available upon request.
            </p>
            <p className="opacity-80">
              These are approximate guide prices, not guaranteed final quotes. Final quotes depend on custom dimensions and composition complexity.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
