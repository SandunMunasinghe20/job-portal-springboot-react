import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import ForgotPassword from './pages/ForgotPassword/ForgotPassword';
import Jobs from './pages/JobsPage/Jobs';
import PostJobs from './pages/PostJobs/PostJobs';
import ViewProfilePage from './pages/ViewProfilePage/ViewProfilePage';
import UsersPage from './pages/UsersPage/UsersPage';
import UpdateJobs from './pages/UpdateJobs/UpdateJobs';
import UpdateProfilePage from './pages/UpdateProfilePage/UpdateProfilePage';
import ApplyJob from './pages/ApplyJob/ApplyJob';
import JobsByCompany from './pages/JobsPage/JobsByCompany';
import ChangePass from './pages/ForgotPassword/ChangePass';
import Applications from './pages/Applications/Applications';
import Home from './pages/Home/Home';
import MyProfile from './components/MyProfile';
import AdminHome from './pages/Admin/AdminHome';
import AdminViewSeekers from './pages/Admin/AdminViewSeekers';
import EmpReceivedApplications from './pages/Applications/EmpReceivedApplications';
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/login" element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/forgotPassword' element={<ForgotPassword />} />
        <Route path='/jobs' element={<Jobs />} />
        <Route path='/postJobs' element={<PostJobs />} />
        <Route path='/profile' element={<ViewProfilePage />} />
        <Route path='/users' element={<UsersPage />} />
        <Route path='/updateJobs' element={<UpdateJobs />} />
        <Route path='/updateProfile' element={<UpdateProfilePage />} />
        <Route path='/applyJob' element={<ApplyJob />} />
        <Route path='/home' element={<Home />} />
        <Route path='/myJobs' element={<JobsByCompany />} />
        <Route path='/reset-password' element={<ChangePass />} />
        <Route path='/myApplications' element={<Applications />} />
        <Route path='/myprof' element={<MyProfile />} />
        <Route path='/adminHome' element={<AdminHome />} />
        <Route path='/seekers' element={<AdminViewSeekers />} />
        <Route path='/receivedApplications' element={<EmpReceivedApplications />} />

      </Routes>

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
