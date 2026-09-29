import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Mail, ArrowLeft, FileText, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

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
  <div className="bg-background min-h-screen">
    {/* Dark Primary Hero */}
    <div className="relative bg-primary text-white py-20 px-4 sm:px-6 lg:px-8 overflow-hidden text-center">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
        <span className="text-[18vw] font-extrabold tracking-tighter text-white/5 uppercase leading-none font-serif">
          POLICY
        </span>
      </div>

      <div className="relative max-w-3xl mx-auto z-10">
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <span className="inline-flex items-center gap-2 border border-amber-300/30 bg-amber-300/10 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.3em] text-amber-300 backdrop-blur-md mb-6">
            <FileText className="w-3.5 h-3.5 text-amber-300" />
            Client Assurance & Terms
          </span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl md:text-5xl font-serif text-white font-bold mb-4"
        >
          {title}
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-xs text-amber-300 uppercase tracking-widest font-semibold"
        >
          Last updated: {lastUpdated}
        </motion.p>
      </div>
    </div>

    {/* Policy Content Card */}
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 -mt-10 relative z-20">
      <div className="bg-white rounded-3xl p-8 sm:p-12 border border-supporting/60 shadow-xl space-y-10">
        <div className="space-y-8 text-secondary leading-relaxed">
          {sections.map((section, idx) => (
            <div key={section.title} className="border-b border-supporting/40 pb-6 last:border-0 last:pb-0">
              <h2 className="text-xl font-serif font-bold text-primary mb-3 flex items-center gap-2">
                <span className="text-amber-600 text-sm font-sans font-bold">0{idx + 1}.</span> {section.title}
              </h2>
              <p className="text-sm sm:text-base leading-relaxed text-secondary">{section.content}</p>
            </div>
          ))}
        </div>

        <div className="pt-8 border-t border-supporting flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-semibold text-secondary">
          <div className="flex items-center gap-2 text-primary">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Questions regarding this policy?</span>
          </div>
          <a href="mailto:care@maheshwarisilk.com" className="inline-flex items-center gap-2 bg-primary/10 text-primary px-5 py-2.5 rounded-full border border-primary/20 hover:bg-primary hover:text-white transition-colors">
            <Mail className="w-3.5 h-3.5 text-accent" /> care@maheshwarisilk.com
          </a>
        </div>
      </div>
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
        content: 'We offer complimentary shipping on all orders above ₹10,000 within India. Orders below ₹10,000 are shipped at a flat rate of ₹250.',
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
    title="Cancellation & Returns"
    lastUpdated="September 24, 2026"
    sections={[
      {
        title: 'Order Cancellations',
        content: 'You can cancel your order at any time before it is shipped. To cancel, simply navigate to your Account > Orders and click "Cancel Order". If your order has already been processed or shipped, it cannot be cancelled.',
      },
      {
        title: 'Refunds for Cancelled Orders',
        content: 'If you cancel an order that has already been paid for, your refund will be initiated immediately. Please note that it may take 5-7 business days for the refund to reflect in your original payment method.',
      },
      {
        title: 'Return Eligibility',
        content: 'If you receive an item and wish to return it, we accept returns within 7 days of delivery for unused, unwashed items in their original packaging. The product must be in the exact condition in which it was received, with all original tags intact.',
      },
      {
        title: 'How to Initiate a Return',
        content: 'Email us at care@maheshwarisilk.com with your order number and reason for return. Our team will respond within 24 hours with instructions for the return shipment. Once we receive and inspect the item, your refund will be processed.',
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

export const RefundPolicy = () => (
  <PolicyPage
    title="Refund Policy"
    lastUpdated="September 24, 2026"
    sections={[
      {
        title: 'Refund Process',
        content: 'Once your return is received and inspected, we will send you an email to notify you that we have received your returned item. We will also notify you of the approval or rejection of your refund.',
      },
      {
        title: 'Approved Refunds',
        content: 'If you are approved, then your refund will be processed, and a credit will automatically be applied to your credit card or original method of payment, within 5-7 business days. Alternatively, you can add your Bank Details in your Account dashboard for direct bank transfers.',
      },
      {
        title: 'Late or Missing Refunds',
        content: 'If you haven’t received a refund yet, first check your bank account again. Then contact your credit card company, it may take some time before your refund is officially posted. If you’ve done all of this and you still have not received your refund yet, please contact us at care@maheshwarisilk.com.',
      },
      {
        title: 'Sale Items',
        content: 'Only regular priced items may be refunded, unfortunately, sale items cannot be refunded.',
      },
    ]}
  />
);
