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


function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/startUi" element={<GetStartUi />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/bookRide" element={<BookRide />} />
      <Route path="/BookConform" element={<BookingConfirmation />} />
      <Route path="/liveRideTrack" element={<LiveRideTracking />} />
      <Route path="/rideHistory" element={<RideHistory />} />
      <Route path="/HelpSupport" element={<HelpSupport />} />
      <Route path="/*" element={<NotFound />} />

    </Routes>
  );
}

export default App;