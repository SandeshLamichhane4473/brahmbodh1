    
import TarotContactSection from "../component/tarrot/TarotContactSection";
 
import TarotReaderCard from "../component/tarrot/TarotReaderCard"; 
import TarotRequestForm from "../component/tarrot/TarotRequestForm";
 
import TarotHero from "../component/tarrot/TarotHero";
export default function Tarrot() {
   

  return (
    <>
          <TarotHero />
 <div className="flex justify-center mt-8 h-5"></div>
    <TarotReaderCard />
    <div className="flex justify-center mt-8 h-5"> </div>
    <TarotRequestForm />
    <TarotContactSection />
    
    
    </>
  );
}
