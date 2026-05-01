// import ShortInfo from "../component/ShortInfo";
// import ExploreCourse from "../component/ExploreCourses";
// import myimage from '../../assets/myphoto.png';
// import PhotoGallery from "../component/PhotoGallary";
 
 
import HomeBlog from "../component/home/HomeBlog";
import HomePhotos from "../component/home/HomePhotos";
import HomeSlogan from "../component/home/HomeSlogan";
import CoursesGrid from "../component/home/CoursesGrid";
import JoinModal from "../component/home/Joinmodal";

const Home = () => {
  
  return (
    <div className="bg-white min-h-screen pl-1 pr-1 ">
      {/* Section 1: Hero Image */}

      

      <HomeSlogan />

       {/* Section 4: Social Links */}
       
      <JoinModal />
      

       <CoursesGrid />


      <HomeBlog />

      {/* Section 2: Courses */}
    

     <HomePhotos />
      {/* Section 3: Photo Gallery */}
     
   
  {/* <ExploreCourse /> */}
      {/* Section 4: Social Links */}
      {/* <SocialLinks /> */}
    </div>
  );
};

export default Home;
