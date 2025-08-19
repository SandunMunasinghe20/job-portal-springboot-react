import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
import Jobs from "./pages/JobsPage/Jobs";
import PostJobs from "./pages/PostJobs/PostJobs";
import ViewProfilePage from "./pages/ViewProfilePage/ViewProfilePage";
import UsersPage from "./pages/UsersPage/UsersPage";
import UpdateJobs from "./pages/UpdateJobs/UpdateJobs";
import UpdateProfilePage from "./pages/UpdateProfilePage/UpdateProfilePage";
import ApplyJob from "./pages/ApplyJob/ApplyJob";
import JobsByCompany from "./pages/JobsPage/JobsByCompany";
import ChangePass from "./pages/ForgotPassword/ChangePass";
import Applications from "./pages/Applications/Applications";
import Home from "./pages/Home/Home";

import AdminHome from "./pages/Admin/AdminHome";
//import AdminViewSeekers from "./pages/Admin/AdminViewSeekers";
import Test from "./pages/Test";
import MsgPage from "./pages/MsgPage/MsgPage";
import MsgConversationPage from "./pages/MsgPage/MsgConversationPage";
import AboutUs from "./FooterComponents/AboutUs";
import PrivacyPolicy from "./FooterComponents/PrivacyPolicy";
import TermsOfService from "./FooterComponents/TermsOfService";
import Support from "./FooterComponents/Support";
import HelpCenter from "./FooterComponents/HelpCenter";
import Security from "./FooterComponents/Security";
import JobPulse from "./FooterComponents/JobPulse";


import { useNavigate } from "react-router-dom";
import { MdMessage } from "react-icons/md";

function App() {
  function FloatingMessageIcon() {
    const navigate = useNavigate();
    //const id = localStorage.getItem("id");
    return (
      <div
        onClick={() => navigate(`/conversation`)}
        className="fixed z-50 p-4 text-white bg-blue-600 rounded-full shadow-lg cursor-pointer bottom-6 right-6 hover:bg-blue-700"
        title="Messages"
      >
        <MdMessage size={24} />
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgotPassword" element={<ForgotPassword />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/postJobs" element={<PostJobs />} />
        <Route path="/profile" element={<ViewProfilePage />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="/updateJobs" element={<UpdateJobs />} />
        <Route path="/updateProfile" element={<UpdateProfilePage />} />
        <Route path="/applyJob" element={<ApplyJob />} />
        <Route path="/home" element={<Home />} />
        <Route path="/myJobs" element={<JobsByCompany />} />
        <Route path="/reset-password" element={<ChangePass />} />
        <Route path="/myApplications" element={<Applications />} />

        <Route path="/adminHome" element={<AdminHome />} />

        <Route path="/test" element={<Test />} />
        <Route path="/msg" element={<MsgPage />} />
        <Route path="/conversation" element={<MsgConversationPage />} />

        <Route path="/about" element={<AboutUs />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="/support" element={<Support />} />
        <Route path="/help" element={<HelpCenter />} />
        <Route path="/security" element={<Security />} />
        <Route path="/job-pulse" element={<JobPulse />} />
      </Routes>

      {/*toast msges*/}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />

      {/*msg icon*/}
      <FloatingMessageIcon />
    </BrowserRouter>
  );
}

export default App;
