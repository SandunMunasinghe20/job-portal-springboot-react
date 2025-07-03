import { Link } from "react-router-dom";
import './NavBar.css';
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function NavBar({ role }) {

    const navigate = useNavigate();

    const [err, setErr] = useState("");
    const [success, setSuccess] = useState("");

    const logout = () => {

        setErr("");
        setSuccess("");


        try {
            localStorage.removeItem("role");
            localStorage.removeItem("auth-token");
            setSuccess("Logout Successful");
            navigate("/login");

        } catch (e) {
            setErr("Failed to Logout");
        }


    }


    if (!role) {
        return (
            <div className="Nav-container">
                <h2>Job Pulse</h2>
                <div className="Nav-links">
                    <Link to='/register'>Register</Link>
                    <Link to='/login'>Login</Link>
                </div>
            </div>
        );
    } else {

        return (
            <div className="Nav-container">
                <h2>Job Pulse</h2>
                {role === 'employer'
                    &&
                    <>
                        <div className="Nav-links">
                            <Link to='/home' >Home</Link>
                            <Link to="/postJobs">Post a Job</Link>
                            <Link to='/myJobs'>My Jobs</Link>
                            <Link to='/profile'>Profile</Link>
                            <button onClick={logout} >Logout</button>
                        </div>
                    </>

                }

                {role === 'seeker'
                    &&
                    <>
                        <div className="Nav-links">
                            <Link to='/home' >Home</Link>
                            <Link to='/applyJob'>Apply a Job</Link>
                            <Link>My Applications</Link>
                            <Link to='/profile'>Profile</Link>
                            <button onClick={logout} >Logout</button>
                        </div>
                    </>

                }
            </div>

        );
    }

}

export default NavBar;