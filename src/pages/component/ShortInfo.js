// components/AboutText.jsx
import logo1 from '../../assets/logo1.png'
 
const ShortInfo = () => {

   return (
  <div className="flex h-[550px]   justify-center items-center">
  <div className="max-w-md text-center">
    <br></br>
    <img
      src={logo1}
      alt="Description"
      className="w-[200px] h-[200px] object-cover  mx-auto rounded-full border-1 border-gray-1 shadow-lg"
    />
    <br />
    <h2 className="text-3xl text-secondary font-bold mb-4">
      अहम् ब्रह्मास्मि · तत्त्वमसि
    </h2>
 
    <p className="text-secondary text-lg leading-relaxed text-secondary">
 
     "यो दुनियाले तपाईलाई संघर्ष गर्न सिकाउछ, तुलना गर्न सिकाउछ, प्रतिष्पर्धा गर्न सिकाउछ, तर <b>योगले</b> तपाईलाई सन्तुलन हुन सिकाउछ, एकाग्र हुन सिकाउछ, पूर्ण हुन सिकाउँछ।"
    </p>
  </div>
</div>

  );
};

export default ShortInfo;