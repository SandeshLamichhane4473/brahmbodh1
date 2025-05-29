import Carousel from "../component/Carousel";
import ShortInfo from "../component/ShortInfo";
import ExploreCourse from "../component/ExploreCourses";
import logo from '../../assets/logo1.png'
import myimage from '../../assets/myphoto.png'
import PhotoGallery from "../component/PhotoGallary";
import SocialLinks from "../component/SocialLinks";
const Home = () => {
   ;

  return (
     <div   className="bg-gray-100 min-h-screen">

      {/* maeque the text lates news */}
     <section className="flex flex-col lg:flex-row w-full   py-1 gap-1  ">
      <div className="lg:w-1/2 w-full flex  ">
        <ShortInfo />
      </div>
        <div className="lg:w-1/2 w-full  flex  flex-col items-center justify-center text-secondary">
      <img
           src={myimage}
           alt="Description"
           className="w-[330px] h-[390px] object-cover  mx-auto rounded-full border-1 border-gray-1 shadow-lg"
         />
        <p className="mt-4 text-xl font-semibold  text-secondary text-center">
        योग प्रशिक्षक, संदेश लामीछाने
      </p>

      <p className="mt-4 text-md font-normal text-gray-500 text-center">
         
         "ब्रह्म नै अन्तिम सत्य हो, अरु सबै क्षणीक मोह-माया हो"
      </p>
    </div>
    </section>


    {/* section 2 contain courses */}
     <ExploreCourse />

    {/* section  3 contain  photo gallaery*/}
    <PhotoGallery />

    {/* Links for the  youtube  */}
    <SocialLinks />
     </div>
  );
};

export default Home;
