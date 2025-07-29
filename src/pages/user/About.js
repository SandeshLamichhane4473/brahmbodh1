 

import React from 'react';
import brandLogo from '../../assets/logo1.png'; // replace with your actual logo path

const About = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Brand Logo */}
      <div className="flex justify-center mb-8">
        <img src={brandLogo} alt="Brand Logo" className="h-20 w-auto" />
      </div>

      {/* Header Section */}
      <header className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4 text-gray-800">हाम्रो बारेमा</h1>
        <p className="text-lg text-gray-600">नेपालका प्राचीन ऋषिहरूको ज्ञानलाई विश्वभर फैलाउने हाम्रो उद्देश्य हो।</p>
      </header>

      {/* Mission */}
      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2 text-blue-700">🎯 मिशन</h2>
        <p className="text-gray-700 ml-4">
          नेपालका प्राचीन ऋषिहरूको ज्ञानलाई विश्वभर फैलाउनु।
        </p>
      </section>

      {/* Vision */}
      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2 text-green-700">👁️ दृष्टिकोण</h2>
        <p className="text-gray-700 ml-4">
          पाँच वर्षको नानिबाबुहरुलाई पनि, सजिलो तरिकाले वेदान्तीय दर्शन बुझाउनु ।
        </p>
      </section>

      {/* Objectives */}
      <section>
        <h2 className="text-2xl font-semibold mb-2 text-purple-700">🎯 उद्देश्यहरू</h2>
        <ol className="list-decimal ml-8 text-gray-700 space-y-1">
          <li key="1">मानिसहरूबाट अज्ञानताको अन्धकार हटाउनु।</li>
          <li key="3">आत्मा वा परम सत्यको साक्षात्कार गर्नु।</li>
        </ol>
      </section>
    </div>
  );
};
 
 

export default About;
