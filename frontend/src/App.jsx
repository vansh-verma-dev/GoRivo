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
import DriverDashboard from "./pages/driver/Driverdashboard";
import DriverRideCompleted from "./pages/driver/Driverridecompleted";
import DriverRideHistory from "./pages/driver/Driverridehistor";
import DriverRideRequest from "./pages/driver/Driverriderequest";
import DriverTrip from "./pages/driver/Drivertrip";

import { PublicOnly, RequireRole } from "./components/RouteGuards";
import DriverProfile from "./pages/driver/DriverProfile";

function App() {
  return (
    <Routes>
      {/* Logged out */}
      <Route element={<PublicOnly />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/startUi" element={<GetStartUi />} />
      </Route>

      {/* Passenger */}
      <Route element={<RequireRole role="passenger" />}>
        <Route path="/passenger/profile" element={<ProfilePage />} />
        <Route path="/passenger/bookRide" element={<BookRide />} />
        <Route path="/passenger/BookConform/:rideId" element={<BookingConfirmation />} />
        <Route path="/passenger/liveRideTrack" element={<LiveRideTracking />} />
        <Route path="/passenger/rideHistory" element={<RideHistory />} />
      </Route>

      {/* Driver */}
      <Route element={<RequireRole role="driver" />}>
        <Route path="/driver/dashboard" element={<DriverDashboard />} />
        <Route path="/driver/rideRequest" element={<DriverRideRequest />} />
        <Route path="/driver/trip" element={<DriverTrip />} />
        <Route path="/driver/rideCompleted" element={<DriverRideCompleted />} />
        <Route path="/driver/rideHistory" element={<DriverRideHistory />} />
        <Route path="/driver/profile" element={<DriverProfile/>} />
      </Route>

      {/* Dono ke liye */}
      <Route path="/HelpSupport" element={<HelpSupport />} />

      <Route path="/*" element={<NotFound />} />
    </Routes>
  );
}

export default App;