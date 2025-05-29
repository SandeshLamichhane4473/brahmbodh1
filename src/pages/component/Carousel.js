import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const sampleImages = [
  {
    src: 'media.istockphoto.com/id/863655882/photo/sadhu-indian-holymen-sitting-in-the-temple.webp?s=1024x1024&w=is&k=20&c=OQbmyTlRkEpA7oz1--fYcS_IB2CmJe1SdDbALy0alDU=',
    alt: 'Technology',
    caption: 'Explore the future with cutting-edge tech courses',
  },
  {
    src: 'https://media.istockphoto.com/id/863655882/photo/sadhu-indian-holymen-sitting-in-the-temple.webp?s=1024x1024&w=is&k=20&c=OQbmyTlRkEpA7oz1--fYcS_IB2CmJe1SdDbALy0alDU=',
    alt: 'Technology',
    caption: 'Explore the future with cutting-edge tech courses',
  },
  {
    src: 'https://media.istockphoto.com/id/1315856341/photo/young-woman-meditating-outdoors-at-park.webp?s=1024x1024&w=is&k=20&c=6sF4-2AMRbexbQM6xg8H3StWwa6WtVUGWhsrp18KN4M=',
    alt: 'Coding',
    caption: 'Learn to code like a pro',
  },
  {
    src: 'https://images.unsplash.com/photo-1664347634072-9bcd38fa4be9?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8eW9nYXxlbnwwfHwwfHx8MA%3D%3D',
    alt: 'AI and Robotics',
    caption: 'Dive into Artificial Intelligence and Robotics',
  },
];

const Carousel = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 200,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    arrows: false,
  };

  return (
     // Full-width section container
  <div className="w-full max-w-screen-lg mx-auto rounded-lg overflow-hidden bg-red-300 shadow-lg">
      <Slider {...settings} className="w-full">
        {sampleImages.map((image, index) => (
          <div key={index} className="relative">
            <img
              src={image.src}
              alt={image.alt}
              className="w-full h-[550px] object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
              <h2 className="text-white text-2xl md:text-4xl font-semibold text-center px-4">
                {image.caption}
              </h2>
            </div>
          </div>
        ))}
      </Slider>
    </div>

  );
};

export default Carousel;
