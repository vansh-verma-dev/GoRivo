import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/home";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import GetStartUi from "./components/GetStartUi";


function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/startUi" element={<GetStartUi />} />

    </Routes>
  );
}

export default App;