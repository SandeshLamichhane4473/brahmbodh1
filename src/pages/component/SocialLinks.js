import { FaFacebook,
  FaYoutube,
  FaInstagram,
  FaWhatsapp,
  FaViber,} from "react-icons/fa";

const socialMedia = [
  {
    icon: <FaFacebook className="text-blue-600 text-2xl" />,
    name: "Facebook",
    url: "https://www.facebook.com/xandesh.lamichhane/",
  },
  {
    icon: <FaYoutube className="text-red-600 text-2xl" />,
    name: "YouTube",
    url: "https://www.youtube.com/@%E0%A4%B8%E0%A4%AE%E0%A5%8D%E0%A4%AA%E0%A5%82%E0%A4%B0%E0%A5%8D%E0%A4%A3%E0%A4%9C%E0%A5%80%E0%A4%B5%E0%A4%A8-%E0%A4%B6%E0%A4%BE%E0%A4%B8%E0%A5%8D%E0%A4%A4%E0%A5%8D%E0%A4%B0",
  },
  {
    icon: <FaInstagram className="text-pink-500 text-2xl" />,
    name: "Instagram",
    url: "https://www.instagram.com/yourprofile",
  },
    {
    icon: <FaWhatsapp className="text-green-500 text-2xl" />,
    name: "WhatsApp",
    url: "https://wa.me/9779844734458", // e.g. https://wa.me/9779812345678
  },
  {
    icon: <FaViber className="text-purple-600 text-2xl" />,
    name: "Viber",
    url: "viber://chat?number=+9779844734458", // Viber deep link
  },
];

const SocialLinks = () => {
  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-3">Follow us on:</h2>
      <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3   justify-center items-center">
        {socialMedia.map((media, idx) => (
            <a
            key={idx}
            href={media.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 hover:bg-gray-100 px-3 py-2 rounded transition"
            >
            {media.icon}
            <span className="text-gray-800 font-medium">{media.name}</span>
            </a>
        ))}
        </div>
    </div>
  );
};

export default SocialLinks;
