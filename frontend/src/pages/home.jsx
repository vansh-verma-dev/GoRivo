import MapSection from "../components/mapSection";
import Navbar from "../components/navbar";
import FindTripForm from "../components/tripForm";

function HomePage() {
    return (
        <>
            <Navbar />
            
            <main className="flex flex-col gap-4 bg-gray-50 p-4 lg:h-[calc(100vh-4rem)] lg:flex-row">
                <div className="w-full lg:w-[30%] lg:min-w-[340px]">
                    <FindTripForm />
                </div>
                <div className="h-[60vh] w-full lg:h-full lg:flex-1">
                    <MapSection />
                </div>
            </main>
        </>
    )
}
export default HomePage;