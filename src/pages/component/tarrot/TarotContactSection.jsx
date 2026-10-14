import React from 'react';
import { MessageCircle, Send } from 'lucide-react';

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------
// These are intentionally left unset rather than filled with invented
// account details. Once Brahm-Bodh's real Messenger page and WhatsApp
// business number are available, set them here and the cards below will
// automatically turn into real, working links.
//
//   const MESSENGER_URL = 'https://m.me/your-real-page';
//   const WHATSAPP_URL = 'https://wa.me/9779800000000';
const MESSENGER_URL = 'https://www.facebook.com/xandesh.lamichhane';
const WHATSAPP_URL = 'https://wa.me/9779844734458';

const contactChannels = [
  {
    key: 'messenger',
    name: 'Facebook Messenger',
    description: 'Receive your reading on Messenger',
    Icon: Send,
    url: MESSENGER_URL,
  },
  {
    key: 'whatsapp',
    name: 'WhatsApp',
    description: 'Receive your reading on WhatsApp',
    Icon: MessageCircle,
    url: WHATSAPP_URL,
  },
];

const TarotContactSection = () => {
  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">Your Guidance Is Just a Message Away</h2>
        <p className="mt-3 text-gray-600">
          Submit your tarot questions and receive your response through your preferred messaging platform.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {contactChannels.map(({ key, name, description, Icon, url }) => {
          const isConfigured = Boolean(url);

          const cardContent = (
            <>
              <div className="w-12 h-12 rounded-full bg-amber-50 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition">
                <Icon size={22} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">{name}</h3>
                <p className="text-sm text-gray-500">{description}</p>
              </div>
            </>
          );

          const baseClasses =
            'group flex items-center gap-4 bg-white rounded-2xl shadow-lg border border-amber-100 p-6 transition';

          if (isConfigured) {
            return (
              <a
                key={key}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className={`${baseClasses} hover:shadow-xl hover:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/60`}
              >
                {cardContent}
              </a>
            );
          }

          return (
            <div key={key} className={`${baseClasses} opacity-70 cursor-not-allowed`} aria-disabled="true">
              {cardContent}
              <span className="ml-auto text-xs text-gray-400 whitespace-nowrap">Not configured yet</span>
            </div>
          );
        })}
      </div>

      <p className="mt-6 text-center text-xs text-gray-400 max-w-xl mx-auto">
        You'll receive a response through your chosen platform once the messaging workflow has been configured.
      </p>
    </section>
  );
};

export default TarotContactSection;