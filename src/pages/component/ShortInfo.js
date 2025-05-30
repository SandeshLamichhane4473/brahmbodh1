// components/AboutText.jsx
import logo1 from '../../assets/logo1.png'
import React, { useState, useEffect } from "react";
 
const ShortInfo = () => {
 
  const headers = [
    "अहम् ब्रह्मास्मि · तत्त्वमसि",
    "सर्वं खल्विदं ब्रह्म",
    "नेति नेति · आत्मा"
  ];

  const paragraphs = [
    "यो दुनियाले तपाईलाई संघर्ष गर्न सिकाउछ, तुलना गर्न सिकाउछ, प्रतिष्पर्धा गर्न सिकाउछ, तर <b>योगले</b> तपाईलाई सन्तुलन हुन सिकाउछ, एकाग्र हुन सिकाउछ, पूर्ण हुन सिकाउँछ।",
    "शारीरिक व्यायामले शक्ति दिन्छ, <b>ध्यानले</b> आत्मा निखार्दछ। जीवनको साँचो उद्देश्य यो समन्वय हो।",
    "शान्त मन, स्थिर शरीर र एकाग्र आत्मा नै <b>योग</b> को सार हो।"
  ];

  const [index, setIndex] = useState(0);


    useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % headers.length);
    }, 7000);

    return () => clearInterval(interval);
  }, [headers.length]);


   return (
    <div className="flex h-[550px] justify-center items-center">
  <div className="max-w-md text-center relative">
    {/* Fixed Image Block */}
    <div className=" h-[200px]  flex justify-center mb-2">
      <img
        src={logo1}
        alt="Description"
        className="w-[200px] h-[200px] object-cover rounded-full border border-gray-300 shadow-lg"
      />
    </div>

    {/* Spacer for the image so content doesn't overlap */}
    <div className="h-[240px]  " >

    {/* Dynamic Header */}
    <h2 className="text-3xl text-secondary font-bold mb-4 transition-all duration-500">
      {headers[index]}
    </h2>

    {/* Dynamic Paragraph */}
    <p
      className="text-secondary text-lg leading-relaxed transition-all duration-500"
      dangerouslySetInnerHTML={{ __html: paragraphs[index] }}
    />
    </div>
  </div>
</div>

  );
};

export default ShortInfo;