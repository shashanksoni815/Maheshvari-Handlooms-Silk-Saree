import React from 'react';

const faqs = [
  {
    category: 'Orders & Shipping',
    questions: [
      {
        q: 'How long will it take to receive my order?',
        a: 'Orders within India are typically delivered within 4-7 business days. International shipping timelines vary between 10-15 business days depending on the destination.'
      },
      {
        q: 'Do you offer free shipping?',
        a: 'Yes, we offer complimentary express shipping on all domestic orders above ₹10,000.'
      },
      {
        q: 'How can I track my order?',
        a: 'Once your order is dispatched, you will receive an email with your tracking number and a link to trace its journey. You can also view this in your Account Dashboard.'
      }
    ]
  },
  {
    category: 'Product & Care',
    questions: [
      {
        q: 'Are your silk sarees authentic?',
        a: 'Absolutely. Every saree comes with an authenticity certificate. We source directly from generational weavers in Varanasi, Kanchipuram, and Chanderi, guaranteeing 100% pure silk.'
      },
      {
        q: 'Does the saree come with a blouse piece?',
        a: 'Yes, all our sarees include an unstitched blouse piece, woven seamlessly with the saree. It is typically 0.8 to 1 meter in length.'
      },
      {
        q: 'How should I care for my silk saree?',
        a: 'We strongly recommend dry cleaning only. For storage, fold them in a muslin cloth and avoid hanging them on metal hangers to maintain the integrity of the weave.'
      }
    ]
  },
  {
    category: 'Returns & Exchanges',
    questions: [
      {
        q: 'What is your return policy?',
        a: 'We accept returns within 7 days of delivery for unused, unwashed items with their original tags intact. Please refer to our full Cancellation & Returns Policy for details.'
      },
      {
        q: 'How long do refunds take?',
        a: 'Once we receive and inspect the returned item, your refund will be processed back to your original payment method within 5-7 business days.'
      }
    ]
  }
];

export const Faq = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-serif text-primary mb-4">Frequently Asked Questions</h1>
        <p className="text-secondary">Find answers to common questions about our products, shipping, and returns.</p>
      </div>

      <div className="space-y-12">
        {faqs.map((group, idx) => (
          <div key={idx}>
            <h2 className="text-2xl font-serif text-primary border-b border-supporting pb-3 mb-6">{group.category}</h2>
            <div className="space-y-6">
              {group.questions.map((faq, i) => (
                <div key={i} className="bg-white p-6 border border-supporting rounded-sm">
                  <h3 className="text-lg font-medium text-primary mb-2">{faq.q}</h3>
                  <p className="text-secondary leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-16 text-center p-8 bg-supporting/20 rounded-sm">
        <p className="text-primary font-medium mb-2">Still have questions?</p>
        <p className="text-secondary text-sm mb-4">Our customer care team is here to assist you.</p>
        <a href="/contact" className="inline-block bg-primary text-white px-8 py-3 uppercase tracking-widest text-xs font-semibold hover:bg-primary/90 transition-colors">
          Contact Support
        </a>
      </div>
    </div>
  );
};
