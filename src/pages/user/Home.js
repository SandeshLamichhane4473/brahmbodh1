// import ShortInfo from "../component/ShortInfo";
// import ExploreCourse from "../component/ExploreCourses";
// import myimage from '../../assets/myphoto.png';
// import PhotoGallery from "../component/PhotoGallary";
 
import HomeSlogan from "../component/HomeSlogan";
import HomeBlog from "../component/HomeBlog";
import HomePhotos from "../component/HomePhotos";
 


const Home = () => {
  
  return (
    <div className="bg-white min-h-screen ">
      {/* Section 1: Hero Image */}
      <HomeSlogan />

       {/* Section 4: Social Links */}
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
