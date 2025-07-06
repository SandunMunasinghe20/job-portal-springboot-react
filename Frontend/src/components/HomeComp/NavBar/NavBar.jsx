import { Link } from "react-router-dom";
import './NavBar.css';
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function NavBar({ role }) {

    const navigate = useNavigate();

    const [err, setErr] = useState("");
    const [success, setSuccess] = useState("");
    const [prevScrollPos, setPrevScrollPos] = useState(window.scrollY);
    const [visible, setVisible] = useState(true);

    const handleSeekers = () => {
        navigate('/users?role=seeker');
    }

    const handleEmployers = () => {
        navigate('/users?role=employer');
    }

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

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollPos = window.scrollY;
            setVisible(prevScrollPos > currentScrollPos || currentScrollPos < 10);
            setPrevScrollPos(currentScrollPos);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [prevScrollPos]);


    if (!role) {
        return (
            <div className={`Nav-container ${visible ? 'nav-visible' : 'nav-hidden'}`}>

                <h2> <button onClick={() => {

                    console.log('Job Pulse clicked!');
                    if (role === 'admin')
                        navigate('/adminHome');
                    else
                        navigate('/home');
                }}>Job Pulse</button></h2>
                <div className="Nav-links">
                    <Link to='/register'>Register</Link>
                    <Link to='/login'>Login</Link>
                </div>
            </div>
        );
    } else {

        return (
            <div className={`Nav-container ${visible ? 'nav-visible' : 'nav-hidden'}`}>

                <h2> <button onClick={() => {
                    console.log('Job Pulse clicked!');
                    navigate('/home');
                }}>Job Pulse</button></h2>


                {role === 'employer'
                    &&
                    <>
                        <div className="Nav-links">

                            <Link to="/postJobs">Post a Job</Link>
                            <Link to='/myJobs'>My Jobs</Link>
                            <Link to='/profile'>Profile</Link>
                            <Link to='/myApplications'>Applications </Link>
                            <button onClick={logout} >Logout</button>
                        </div>
                    </>

                }

                {role === 'seeker'
                    &&
                    <>
                        <div className="Nav-links">

                            <Link to='/jobs'>Apply a Job</Link>
                            <Link to='/myApplications'>My Applications</Link>
                            <Link to='/profile'>Profile</Link>
                            <button onClick={logout} >Logout</button>
                        </div>
                    </>

                }

                {role === 'admin'
                    &&
                    <div className="Nav-links">
                        <Link to='/jobs'>Jobs</Link>
                        <Link to='/myApplications'>Job Applications</Link>
                        <button onClick={() => { handleSeekers() }}>Job Seekers</button>
                        <button onClick={() => { handleEmployers() }}>Job Employers</button>
                        <Link to='/profile'>Profile</Link>
                        <button onClick={logout} >Logout</button>
                    </div >

                }

            </div >

        );
    }

}

export default NavBar;