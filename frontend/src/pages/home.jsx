import Footer from "../components/Footer";
import HeroSection from "../components/heroSection";
import RideBookBar from "../components/Home_ride_Book";
import Navbar from "../components/navbar";
import SelectRide from "../components/SelectRide";
import WhyGorivoSection from "../components/WhyGoRivoSection";
function HomePage(){
    return(
         <>
         <Navbar/>
         <HeroSection/>
         <RideBookBar/>
         <SelectRide/>
         <WhyGorivoSection/>
         <Footer/>
         </>
    )
}
export default HomePage;