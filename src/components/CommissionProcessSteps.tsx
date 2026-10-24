import React from 'react';
import { motion } from 'framer-motion';
import { COMMISSION_STEPS } from '../data/pricing';
import { Frame } from './Frame';

export const CommissionProcessSteps: React.FC = () => {
  return (
    <div className="w-full">
      <div className="text-center max-w-2xl mx-auto mb-14 md:mb-20">
        <span className="text-[10px] font-sans tracking-[0.35em] text-theme-accent uppercase font-semibold block mb-3">
          THE COLLABORATIVE JOURNEY
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light uppercase tracking-widest text-theme-text mb-4">
          How a Commission Unfolds
        </h2>
        <p className="font-sans text-xs md:text-sm text-theme-text-muted opacity-80 leading-relaxed uppercase tracking-wider">
          An unhurried creative dialogue centered on your space, story, and feeling.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        {COMMISSION_STEPS.map((item, idx) => (
          <motion.div
            key={item.step}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1, duration: 0.6 }}
          >
            <Frame className="h-full flex flex-col justify-between p-6">
              <div>
                <div className="flex items-baseline justify-between mb-4 border-b border-theme-border pb-3">
                  <span className="font-serif text-2xl md:text-3xl font-light text-theme-accent">
                    {item.step}
                  </span>
                  <span className="text-[9px] font-sans tracking-[0.25em] text-theme-text-muted opacity-60 uppercase font-mono">
                    PHASE 0{idx + 1}
                  </span>
                </div>

                <h3 className="font-serif text-base font-light text-theme-text tracking-wide uppercase mb-1">
                  {item.title}
                </h3>
                <div className="text-[9px] uppercase tracking-[0.25em] text-theme-accent mb-3 font-sans font-semibold">
                  {item.subtitle}
                </div>

                <p className="text-xs font-sans text-theme-text-muted opacity-85 leading-relaxed tracking-wide">
                  {item.description}
                </p>
              </div>

              <div className="mt-6 pt-3 border-t border-theme-border flex justify-between text-[8px] tracking-[0.25em] uppercase text-theme-text-muted opacity-50 font-sans">
                <span>SHALA</span>
                <span>COLLABORATIVE</span>
              </div>
            </Frame>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
