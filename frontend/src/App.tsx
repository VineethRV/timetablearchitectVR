import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Homepage";
import Signin from "./pages/SignIn";
import Signup from "./pages/Signup";
import  Dashboard  from "./pages/dashboard/dashboard";
import { Toaster } from "sonner";
import OnboardingPage from "./pages/Onboarding";
import Onboard from "./pages/register";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/onboard" element={<Onboard/>}/>
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="/dashboard/*" element={<Dashboard />}>
        </Route>
      </Routes>
      <Toaster/>
    </BrowserRouter>
  );

}

export default App;
