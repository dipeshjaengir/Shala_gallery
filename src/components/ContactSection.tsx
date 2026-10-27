import React, { useState } from 'react';
import { Mail, Send, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { InquiryFormData } from '../types/artwork';
import { Magnetic } from './Magnetic';
import { SectionHeader } from './SectionHeader';
import { SectionContainer } from './SectionContainer';

// Inline Instagram SVG icon
const InstagramIcon = ({ size = 16, className = '' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

interface ContactSectionProps {
  initialArtworkTitle?: string;
  initialInquiryType?: InquiryFormData['inquiryType'];
  initialDimensions?: string;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  initialArtworkTitle = '',
  initialInquiryType = 'Custom Commission',
  initialDimensions = '',
}) => {
  const [formData, setFormData] = useState<InquiryFormData>({
    fullName: '',
    email: '',
    inquiryType: initialInquiryType,
    artworkTitle: initialArtworkTitle,
    dimensions: initialDimensions,
    budgetRange: '',
    message: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submissionNotice, setSubmissionNotice] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Please enter your full name.';
    if (!formData.email.trim()) {
      newErrors.email = 'Please provide your email address.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please provide a valid email address.';
    }
    if (!formData.message.trim()) newErrors.message = 'Please provide details on your space or inquiry.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getEmailBody = (): string => {
    return [
      `Full Name: ${formData.fullName}`,
      `Email Address: ${formData.email}`,
      `Inquiry Type: ${formData.inquiryType}`,
      formData.artworkTitle ? `Artwork / Project Title: ${formData.artworkTitle}` : null,
      formData.dimensions ? `Approximate Dimensions: ${formData.dimensions}` : null,
      formData.budgetRange ? `Budget Range: ${formData.budgetRange}` : null,
      `\nMessage / Space Details:\n${formData.message}`,
      `\n---\nSent via SHALAGALLERY Fine Art Portfolio (shalagallery.com)`,
    ]
      .filter(Boolean)
      .join('\n');
  };

  const openMailClientFallback = () => {
    const subject = encodeURIComponent(
      `SHALAGALLERY Inquiry: ${formData.inquiryType}${formData.artworkTitle ? ` — ${formData.artworkTitle}` : ''}`
    );
    const body = encodeURIComponent(getEmailBody());
    window.location.href = `mailto:shalagallery@gmail.com?subject=${subject}&body=${body}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setSubmissionNotice(null);

    try {
      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          inquiryType: formData.inquiryType,
          artworkTitle: formData.artworkTitle,
          dimensions: formData.dimensions,
          budgetRange: formData.budgetRange,
          message: formData.message,
        }),
      });

      const data = await response.json().catch(() => null);

      if (response.ok && data?.status === 'ok') {
        setIsSuccess(true);
        setSubmissionNotice(
          data.message || 'Your inquiry has been received. Asma will review your request personally.'
        );
        // Clear fields on successful submission
        setFormData({
          fullName: '',
          email: '',
          inquiryType: initialInquiryType,
          artworkTitle: '',
          dimensions: '',
          budgetRange: '',
          message: '',
        });
      } else {
        // Fallback to opening default email application seamlessly
        setIsSuccess(false);
        const errMsg = data?.message || 'Connecting to your email application...';
        setSubmissionNotice(`${errMsg} Opening your mail client to send directly to shalagallery@gmail.com.`);
        openMailClientFallback();
      }
    } catch (err) {
      console.warn('[Inquiry Submission Fallback]', err);
      setIsSuccess(false);
      setSubmissionNotice(
        'Opening your default email app with this inquiry pre-filled to shalagallery@gmail.com.'
      );
      openMailClientFallback();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SectionContainer className="pt-4 sm:pt-6 pb-20 md:pb-24">
      <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-start">
        {/* Left Column: CTA & Channels */}
        <div className="w-full lg:w-5/12 text-left">
          <SectionHeader
            label="GET IN TOUCH"
            title="Let's Collaborate"
            className="mb-8 md:mb-12"
          />
          <p className="font-sans text-xs md:text-sm leading-relaxed text-theme-text-muted opacity-80 tracking-wider mb-12">
            For acquisitions of original artwork, bespoke residential commissions, Arabic calligraphy projects, or interior consultations. Reach out directly or complete the inquiry form.
          </p>

          <div className="flex flex-col gap-8 font-sans text-xs tracking-wider">
            {/* Email */}
            <div className="flex items-center gap-4">
              <div className="p-3 bg-theme-bg-card border border-theme-border rounded-full transition-colors duration-500">
                <Mail size={16} strokeWidth={1.5} className="text-theme-text" />
              </div>
              <div>
                <span className="block text-[8px] tracking-[0.25em] text-theme-text-muted opacity-60 uppercase font-semibold">
                  EMAIL
                </span>
                <a
                  href="mailto:shalagallery@gmail.com"
                  className="text-theme-text font-medium hover:text-theme-accent transition-colors"
                >
                  shalagallery@gmail.com
                </a>
              </div>
            </div>

            {/* Instagram */}
            <div className="flex items-center gap-4">
              <div className="p-3 bg-theme-bg-card border border-theme-border rounded-full transition-colors duration-500">
                <InstagramIcon size={16} className="text-theme-text" />
              </div>
              <div>
                <span className="block text-[8px] tracking-[0.25em] text-theme-text-muted opacity-60 uppercase font-semibold">
                  INSTAGRAM
                </span>
                <a
                  href="https://www.instagram.com/shalagallery/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-theme-text font-medium hover:text-theme-accent transition-colors"
                >
                  @shalagallery
                </a>
              </div>
            </div>

            {/* Studio Note */}
            <div className="p-5 bg-theme-bg-card border border-theme-border rounded-sm mt-4">
              <span className="block text-[8px] tracking-[0.25em] text-theme-accent uppercase font-semibold mb-1">
                STUDIO LOCATION &amp; SHIPMENTS
              </span>
              <p className="text-[11px] text-theme-text-muted opacity-75 leading-relaxed font-sans normal-case">
                Based in Ireland. Commissioned paintings and framed calligraphy are packaged with archival care and shipped to collectors internationally across 6 countries.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Line-styled Form Panel */}
        <div className="w-full lg:w-7/12 bg-theme-bg-card border border-theme-border p-6 sm:p-8 md:p-12 shadow-premium relative text-left transition-all duration-500">
          {/* Decorative frame corners */}
          <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-theme-accent" />
          <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-theme-accent" />

          <form onSubmit={handleSubmit} className="flex flex-col gap-7 font-sans text-xs" noValidate>
            {/* Full Name & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex flex-col gap-1.5 relative">
                <label className="text-[9px] tracking-[0.2em] text-theme-text-muted opacity-60 uppercase font-semibold">
                  Full Name <span className="text-theme-accent">*</span>
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => {
                    setFormData({ ...formData, fullName: e.target.value });
                    if (errors.fullName) setErrors({ ...errors, fullName: '' });
                  }}
                  required
                  placeholder="Eleanor Vance"
                  className="py-2.5 bg-transparent border-b border-theme-border-medium focus:border-theme-accent outline-none transition-colors text-theme-text font-medium placeholder-theme-text-muted/40"
                />
                {errors.fullName && <p className="text-[10px] text-red-400 mt-1">{errors.fullName}</p>}
              </div>

              <div className="flex flex-col gap-1.5 relative">
                <label className="text-[9px] tracking-[0.2em] text-theme-text-muted opacity-60 uppercase font-semibold">
                  Email Address <span className="text-theme-accent">*</span>
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value });
                    if (errors.email) setErrors({ ...errors, email: '' });
                  }}
                  required
                  placeholder="eleanor@example.com"
                  className="py-2.5 bg-transparent border-b border-theme-border-medium focus:border-theme-accent outline-none transition-colors text-theme-text font-medium placeholder-theme-text-muted/40"
                />
                {errors.email && <p className="text-[10px] text-red-400 mt-1">{errors.email}</p>}
              </div>
            </div>

            {/* Inquiry Type */}
            <div className="flex flex-col gap-1.5 relative">
              <label className="text-[9px] tracking-[0.2em] text-theme-text-muted opacity-60 uppercase font-semibold">
                Inquiry Type
              </label>
              <select
                value={formData.inquiryType}
                onChange={(e) =>
                  setFormData({ ...formData, inquiryType: e.target.value as InquiryFormData['inquiryType'] })
                }
                className="py-2.5 bg-transparent border-b border-theme-border-medium focus:border-theme-accent outline-none transition-colors text-theme-text font-medium"
              >
                <option value="Existing Artwork" className="bg-theme-bg text-theme-text">Existing Artwork (e.g. Memories)</option>
                <option value="Custom Commission" className="bg-theme-bg text-theme-text">Custom Bespoke Commission</option>
                <option value="Arabic Calligraphy" className="bg-theme-bg text-theme-text">Arabic Calligraphy Commission</option>
                <option value="Interior Design Collaboration" className="bg-theme-bg text-theme-text">Interior Design Collaboration</option>
                <option value="Other" className="bg-theme-bg text-theme-text">Other Inquiry</option>
              </select>
            </div>

            {/* Artwork Title & Dimensions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex flex-col gap-1.5 relative">
                <label className="text-[9px] tracking-[0.2em] text-theme-text-muted opacity-60 uppercase font-semibold">
                  Artwork Title (Optional)
                </label>
                <input
                  type="text"
                  value={formData.artworkTitle}
                  onChange={(e) => setFormData({ ...formData, artworkTitle: e.target.value })}
                  placeholder="e.g. Memories"
                  className="py-2.5 bg-transparent border-b border-theme-border-medium focus:border-theme-accent outline-none transition-colors text-theme-text font-medium placeholder-theme-text-muted/40"
                />
              </div>

              <div className="flex flex-col gap-1.5 relative">
                <label className="text-[9px] tracking-[0.2em] text-theme-text-muted opacity-60 uppercase font-semibold">
                  Dimensions / Scale (Optional)
                </label>
                <input
                  type="text"
                  value={formData.dimensions}
                  onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })}
                  placeholder="e.g. A2, 70 × 50 cm, or Wall Width"
                  className="py-2.5 bg-transparent border-b border-theme-border-medium focus:border-theme-accent outline-none transition-colors text-theme-text font-medium placeholder-theme-text-muted/40"
                />
              </div>
            </div>

            {/* Budget Range */}
            <div className="flex flex-col gap-1.5 relative">
              <label className="text-[9px] tracking-[0.2em] text-theme-text-muted opacity-60 uppercase font-semibold">
                Budget Range (Optional — guide prices €75 – €1,000+)
              </label>
              <input
                type="text"
                value={formData.budgetRange}
                onChange={(e) => setFormData({ ...formData, budgetRange: e.target.value })}
                placeholder="e.g. €300 – €600, or €1,500+"
                className="py-2.5 bg-transparent border-b border-theme-border-medium focus:border-theme-accent outline-none transition-colors text-theme-text font-medium placeholder-theme-text-muted/40"
              />
            </div>

            {/* Message */}
            <div className="flex flex-col gap-1.5 relative">
              <label className="text-[9px] tracking-[0.2em] text-theme-text-muted opacity-60 uppercase font-semibold">
                Message / Space Details <span className="text-theme-accent">*</span>
              </label>
              <textarea
                rows={4}
                value={formData.message}
                onChange={(e) => {
                  setFormData({ ...formData, message: e.target.value });
                  if (errors.message) setErrors({ ...errors, message: '' });
                }}
                required
                placeholder="Describe your space, atmosphere, color palette, memory, or desired artwork..."
                className="py-2.5 bg-transparent border-b border-theme-border-medium focus:border-theme-accent outline-none transition-colors text-theme-text font-medium resize-none placeholder-theme-text-muted/40"
              />
              {errors.message && <p className="text-[10px] text-red-400 mt-1">{errors.message}</p>}
            </div>

            {/* Submission notice */}
            {submissionNotice && (
              <div
                className={`p-4 border text-xs flex items-start gap-2.5 transition-all ${
                  isSuccess
                    ? 'bg-theme-bg-surface border-theme-accent/50 text-theme-text'
                    : 'bg-theme-bg-surface border-theme-border text-theme-text'
                }`}
              >
                {isSuccess ? (
                  <CheckCircle2 size={15} className="text-theme-accent shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle size={15} className="text-theme-accent shrink-0 mt-0.5" />
                )}
                <span className="opacity-90 leading-relaxed font-sans">{submissionNotice}</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="mt-2 flex flex-wrap items-center gap-4">
              <Magnetic range={40} strength={0.2}>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-theme-text text-theme-bg border border-theme-text hover:bg-transparent hover:text-theme-text font-sans text-[10px] tracking-[0.3em] uppercase py-3.5 px-8 transition-all font-semibold flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      TRANSMITTING <Loader2 size={12} className="animate-spin" />
                    </>
                  ) : isSuccess ? (
                    <>
                      INQUIRY SENT <CheckCircle2 size={12} className="text-theme-accent" />
                    </>
                  ) : (
                    <>
                      SEND INQUIRY <Send size={10} />
                    </>
                  )}
                </button>
              </Magnetic>

              <button
                type="button"
                onClick={openMailClientFallback}
                className="text-[9px] tracking-[0.2em] uppercase text-theme-text-muted hover:text-theme-accent transition-colors underline underline-offset-4 font-sans cursor-pointer opacity-70 hover:opacity-100"
              >
                Open in Email App &rarr;
              </button>
            </div>
          </form>
        </div>
      </div>
    </SectionContainer>
  );
};
