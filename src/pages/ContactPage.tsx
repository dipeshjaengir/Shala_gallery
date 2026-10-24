import React from 'react';
import { ContactSection } from '../components/ContactSection';
import { InquiryFormData } from '../types/artwork';

interface ContactPageProps {
  initialArtworkTitle?: string;
  initialInquiryType?: InquiryFormData['inquiryType'];
  initialDimensions?: string;
}

export const ContactPage: React.FC<ContactPageProps> = ({
  initialArtworkTitle = '',
  initialInquiryType = 'Custom Commission',
  initialDimensions = '',
}) => {
  return (
    <div className="w-full bg-theme-bg text-theme-text pt-2 sm:pt-4 pb-16">
      <ContactSection
        initialArtworkTitle={initialArtworkTitle}
        initialInquiryType={initialInquiryType}
        initialDimensions={initialDimensions}
      />
    </div>
  );
};
