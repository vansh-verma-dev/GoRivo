import { Route, Routes, Navigate } from "react-router-dom";
import HomePage from "./pages/homePage";
import LoginPage from "./auth/loginPage";
import SignupPage from "./auth/signUpPage";

import PassengerProfile from "./passengerPages/passengerProfile";
import BookRide from "./passengerPages/bookRide";
import ActiveRideTracker from "./passengerPages/activeRideTracker";
import MyRides from "./passengerPages/myRides";

import DriverProfile from "./driverPages/driverProfile";
import AvailableRides from "./driverPages/availableRides";
import DriverTripConsole from "./driverPages/driverTripConsole";

import { PublicOnly, RequireRole } from "./components/routeGuards";
import DriverDashboard from "./driverPages/driverDashboard";
import DriverHistory from "./driverPages/driverHistory";

function App() {
  return (
    <Routes>
      {/* Logged-out / Public Routes */}
      <Route element={<PublicOnly />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
      </Route>

      {/* Passenger Only Routes */}
      <Route element={<RequireRole role="passenger" />}>
        <Route path="/passenger/profile" element={<PassengerProfile />} />
        <Route path="/passenger/bookRide" element={<BookRide />} />
        <Route path="/passenger/activeride/:rideId" element={<ActiveRideTracker />} />
        <Route path="/passenger/myride" element={<MyRides />} />
      </Route>

      {/* Driver Only Routes */}
      <Route element={<RequireRole role="driver" />}>
        <Route path="/driver/profile" element={<DriverProfile />} />
        <Route path="/driver/availableRides" element={<AvailableRides />} />
        <Route path="/driver/dashboard" element={<DriverDashboard />} />
        <Route path="/driver/history" element={<DriverHistory />} />
        <Route path="/driver/driverTrip/:rideId" element={<DriverTripConsole />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;