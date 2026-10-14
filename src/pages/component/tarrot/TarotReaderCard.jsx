import React from 'react';
import readerPhoto from '../../../assets/reader-photo.png';

// ---------------------------------------------------------------------------
// To use your own photo: replace src/assets/reader-photo.png with your image
// (keep the same filename, or update the import path above), and change the
// name below.
// ---------------------------------------------------------------------------
const READER_NAME = 'Salina Archarya';

const TarotReaderCard = () => {
  return (
    <div className="max-w-sm mx-auto bg-white rounded-2xl shadow-lg border border-amber-100 px-8 py-10 text-center">
      <img
        src={readerPhoto}
        alt={READER_NAME}
        className="w-45 h-45 sm:w-40 sm:h-40 mx-auto rounded-full object-cover border-4 border-amber-100 shadow-md"
      />
      <h3 className="mt-5 text-xl font-bold text-gray-800">{READER_NAME}</h3>
       <h2 className="mt-0 text-sm font-bold text-gray-800">Tarrot Reader</h2>
    </div>
  );
};

export default TarotReaderCard;