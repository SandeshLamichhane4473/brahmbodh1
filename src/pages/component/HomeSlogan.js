 import owner from '../../assets/myphoto.png';
import slogan from '../../assets/slogan.png'
const HomeSlogan = () => {
  return (
    <div className="w-full flex flex-col md:flex-row items-center justify-between px-4 md:px-20 py-10 ">
      
      {/* Left: Company Logo */}
      <div className=" md:mb-0 rounded-full ">
        <img src={slogan} alt="Company Logo"   />
      </div>

      {/* Right: Owner Info */}
     <div className="flex items-center   space-x-1">
  <div className="flex items-center justify-center p-4 md:h-auto">
    <div className="flex flex-col items-center justify-center p-4 md:h-auto">
      {/* Image */}
      <img
        src={owner}
        alt="Owner"
        className="w-full h-60 max-h-[90vh] object-contain md:w-72 md:h-72 md:object-cover rounded-none md:rounded-full"
      />

      {/* Name */}
      <h2 className="mt-4 text-xl md:text-2xl font-semibold text-gray-800">
        संदेश लामीछाने
      </h2>

      {/* Title */}
      <p className="text-sm text-gray-600">वेदान्त विचारक</p>
    </div>
  </div>
 
     </div>
    </div>
  );
};

export default HomeSlogan;

 



// तिमी  मलाई समय देउ,


//  म तिमीलाई वेदान्त दिन्छु ।