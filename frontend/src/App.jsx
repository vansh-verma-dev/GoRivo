import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/home";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import GetStartUi from "./components/GetStartUi";
import ProfilePage from "./pages/ProfilePage";
import NotFound from "./pages/NotFound";
import BookRide from "./pages/BookRide";
import BookingConfirmation from "./passinger/BookingConfirmationPage";
import LiveRideTracking from "./passinger/Liveridetracking ";
import RideHistory from "./passinger/Ridehistory ·";
import HelpSupport from "./pages/HelpSupport";
import DriverHome from "./pages/driver/DriverHome";


function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/startUi" element={<GetStartUi />} />
      
      <Route path="/passenger/profile" element={<ProfilePage />} />
      <Route path="/passenger/bookRide" element={<BookRide />} />
      <Route path="/passenger/BookConform/:rideId" element={<BookingConfirmation />} />
      <Route path="/passenger/liveRideTrack" element={<LiveRideTracking />} />
      <Route path="/passenger/rideHistory" element={<RideHistory />} />
      <Route path="/HelpSupport" element={<HelpSupport />} />
      <Route path="/driver/home" element={<DriverHome/>} />
     

      <Route path="/*" element={<NotFound />} />

    </Routes>
  );
}

export default App;