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
import MyProfile from "./components/MyProfile";
import AdminHome from "./pages/Admin/AdminHome";
//import AdminViewSeekers from "./pages/Admin/AdminViewSeekers";
import Test from "./pages/Test";
import MsgPage from "./pages/MsgPage/MsgPage";
import MsgConversationPage from "./pages/MsgPage/MsgConversationPage";
//import './App.css'
import { useNavigate } from "react-router-dom";
import { MdMessage } from "react-icons/md";

function App() {
  function FloatingMessageIcon() {
    const navigate = useNavigate();
    const id = localStorage.getItem("id");
    return (
      <div
        onClick={() => navigate(`/conversation`)}
        className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg cursor-pointer z-50"
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
    </BrowserRouter>
  );
}

export default App;
