import React, { useState } from "react";
 
import d from "../../assets/tmp/4.jpeg";
import e from "../../assets/tmp/5.jpeg";
 

const images = [
  { src: d, desc: "योग अभ्यास सत्र १" },
  { src: e, desc: "प्रशिक्षण कक्षा" },
  { src: d, desc: "ध्यान अभ्यास" },
  { src: d, desc: "गुरुजनसंग संवाद" },
  { src: e, desc: "योग दिवस समारोह" },
  { src: e, desc: "आसन प्रदर्शन" },
  { src: d, desc: "समूह साधना" },
  { src: d, desc: "योग शिविर" },
  { src: e, desc: "प्रमाणपत्र वितरण" },
  { src: d, desc: "शान्ति साधना" },
  { src: e, desc: "योग दिवस समारोह" },
  { src: d, desc: "आसन प्रदर्शन" },
  { src: e, desc: "समूह साधना" },
  
];

const PhotoGallery = () => {
  const [selectedImage, setSelectedImage] = useState(null);

  const openModal = (img) => setSelectedImage(img);
  const closeModal = () => setSelectedImage(null);

  return (
    <div className="p-6 bg-gray-100">
      <h2 className="text-2xl font-bold mb-4 text-center">📸 फोटो ग्यालरी</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {images.map((img, index) => (
          <div
            key={index}
            className="bg-white rounded shadow-md overflow-hidden cursor-pointer"
            onClick={() => openModal(img)}
          >
            <img
              src={img.src}
              alt={`Gallery ${index + 1}`}
              className="w-full h-48 object-cover"
            />
            <p className="p-2 text-center text-sm text-gray-700">{img.desc}</p>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg max-w-2xl w-full relative">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-gray-500 hover:text-black text-2xl"
            >
              &times;
            </button>
            <img
              src={selectedImage.src}
              alt="Full"
              className="w-full max-h-[70vh] object-contain"
            />
            <p className="mt-2 text-center text-gray-700">{selectedImage.desc}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhotoGallery;
