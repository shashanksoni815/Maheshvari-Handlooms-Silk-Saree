import React from 'react';
import { Link } from 'react-router-dom';

interface PolicySection {
  title: string;
  content: string;
}

interface PolicyPageProps {
  title: string;
  lastUpdated: string;
  sections: PolicySection[];
}

const PolicyPage = ({ title, lastUpdated, sections }: PolicyPageProps) => (
  <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
    <div className="mb-10 border-b border-gray-200 pb-8">
      <h1 className="text-3xl md:text-4xl font-serif text-primary mb-3">{title}</h1>
      <p className="text-sm text-gray-500">Last updated: {lastUpdated}</p>
    </div>
    <div className="space-y-8 text-secondary leading-relaxed">
      {sections.map((section) => (
        <div key={section.title}>
          <h2 className="text-lg font-medium text-primary mb-3">{section.title}</h2>
          <p className="text-sm">{section.content}</p>
        </div>
      ))}
    </div>
    <div className="mt-12 pt-8 border-t border-gray-200 text-sm text-gray-500">
      Questions? Contact us at{' '}
      <a href="mailto:care@maheshwarisilk.com" className="text-primary hover:underline">
        care@maheshwarisilk.com
      </a>
    </div>
  </div>
);

export const ShippingPolicy = () => (
  <PolicyPage
    title="Shipping Policy"
    lastUpdated="September 1, 2026"
    sections={[
      {
        title: 'Free Shipping',
        content: 'We offer complimentary shipping on all orders above ₹10,000 within India. Orders below ₹10,000 are shipped at a flat rate of ₹500.',
      },
      {
        title: 'Processing Time',
        content: 'All orders are carefully inspected, quality-checked, and packaged within 1-2 business days of payment confirmation. You will receive a shipping confirmation email with tracking details once your order is dispatched.',
      },
      {
        title: 'Delivery Timeline',
        content: 'Standard delivery within India takes 4-7 business days depending on your location. Metro cities typically receive orders within 4-5 business days. Remote areas may take up to 10 business days.',
      },
      {
        title: 'International Shipping',
        content: 'We ship internationally to select countries. International shipping rates and timelines are calculated at checkout. Customs duties and import taxes are the responsibility of the buyer.',
      },
    ]}
  />
);

export const CancellationPolicy = () => (
  <PolicyPage
    title="Returns & Exchanges"
    lastUpdated="September 1, 2026"
    sections={[
      {
        title: 'Our Commitment',
        content: 'Every saree at Maheshwari Silk is carefully handcrafted and quality-inspected before dispatch. We stand fully behind the authenticity and quality of every piece we ship.',
      },
      {
        title: 'Return Eligibility',
        content: 'We accept returns within 7 days of delivery for unused, unwashed items in their original packaging. The product must be in the exact condition in which it was received, with all original tags intact.',
      },
      {
        title: 'Non-Returnable Items',
        content: 'Custom-ordered sarees, pieces that have been blouse-stitched, and items purchased during sale events are not eligible for return or exchange.',
      },
      {
        title: 'How to Initiate a Return',
        content: 'Email us at care@maheshwarisilk.com with your order number and reason for return. Our team will respond within 24 hours with instructions for the return shipment. Once we receive and inspect the item, your refund will be processed within 5-7 business days.',
      },
    ]}
  />
);

export const PrivacyPolicy = () => (
  <PolicyPage
    title="Privacy Policy"
    lastUpdated="September 1, 2026"
    sections={[
      {
        title: 'Information We Collect',
        content: 'We collect personal information you provide when creating an account (name, email, password), placing an order (shipping address, phone number), and when you contact our support team. We also collect anonymous browsing data to improve our website.',
      },
      {
        title: 'How We Use Your Information',
        content: 'Your information is used solely to process and fulfil your orders, send you transactional emails, respond to your inquiries, and (with your consent) send you updates on new collections and offers.',
      },
      {
        title: 'Data Security',
        content: 'Your data is protected using industry-standard SSL encryption. Passwords are hashed and never stored in plain text. We do not store your payment card details; all payment processing is handled securely by Razorpay.',
      },
      {
        title: 'Third-Party Sharing',
        content: 'We do not sell, rent, or share your personal information with third parties except as required to fulfil your order (e.g., shipping partners) or as required by law.',
      },
      {
        title: 'Your Rights',
        content: 'You may request access to, correction of, or deletion of your personal data at any time by emailing care@maheshwarisilk.com. We will respond within 30 days.',
      },
    ]}
  />
);

export const TermsAndConditions = () => (
  <PolicyPage
    title="Terms of Service"
    lastUpdated="September 1, 2026"
    sections={[
      {
        title: 'Acceptance of Terms',
        content: 'By accessing or using the Maheshwari Silk website, you agree to be bound by these Terms of Service. If you do not agree, please do not use our services.',
      },
      {
        title: 'Intellectual Property',
        content: 'All content, images, designs, and branding on this website are the exclusive property of Maheshwari Silk. Unauthorized reproduction or commercial use is strictly prohibited.',
      },
      {
        title: 'Pricing & Availability',
        content: 'Because our products are handwoven and unique, availability is subject to change without notice. We reserve the right to modify prices or discontinue items at any time.',
      },
    ]}
  />
);

export const CareGuide = () => (
  <PolicyPage
    title="Silk Care Guide"
    lastUpdated="September 1, 2026"
    sections={[
      {
        title: 'Washing Instructions',
        content: 'Strictly dry clean only. Never hand wash or machine wash pure silk, especially those with zari (metallic) borders, as water can cause colors to bleed and the zari to tarnish.',
      },
      {
        title: 'Storage',
        content: 'Fold your silk sarees wrapped in a pure cotton or muslin cloth. This allows the fabric to breathe while protecting it from moisture and friction. Do not use plastic covers.',
      },
      {
        title: 'Airing Out',
        content: 'Unfold and air out your silk sarees in a shaded area every 3 to 4 months to prevent the folds from permanently creasing and to prevent any moisture buildup.',
      },
    ]}
  />
);
