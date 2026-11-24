import DriverPartnerSection from "../components/driverPartnerSection";
import Footer from "../components/footer";
import HeroSection from "../components/heroSection";
import HowItWorks from "../components/howItWorks";
import Navbar from "../components/navbar";
import RideCategories from "../components/rideCategories";
import SafetyFeatures from "../components/safetyFeatures";

function HomePage(){
    return(
        <div>
            <Navbar/>
            <HeroSection/>
            <RideCategories/>
            <HowItWorks/>
            <SafetyFeatures/>
            <DriverPartnerSection/>
            <Footer/>
        </div>
    )
};
export default HomePage;