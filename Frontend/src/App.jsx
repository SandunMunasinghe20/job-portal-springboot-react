import { BrowserRouter ,Routes ,Route } from 'react-router-dom';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import ForgotPassword from './pages/ForgotPassword/ForgotPassword';
import Jobs from './pages/JobsPage/Jobs';
import PostJobs from './pages/PostJobs/PostJobs';
import './App.css'

function App() {
  return(
    <BrowserRouter>
      <Routes>

        <Route path="/login" element={<Login />} />
        <Route path='/register' element={<Register/>} />
        <Route path='/forgotPassword' element={<ForgotPassword/>} />
        <Route path='/jobs' element={<Jobs/>} />
        <Route path='/postJobs' element={<PostJobs/>} />      
        </Routes>
    </BrowserRouter>
  );
}

export default App;
