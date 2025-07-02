import React, { useEffect, useState } from 'react';
import SubmitButton from '../../components/submitButton/submitbutton';
import './NavBar.css';
import { useNavigate } from 'react-router-dom';

export default function NavBar(){

    const [isLogged,setIsLogged] = useState(false);
    const [role,setRole] = useState(null);

    const navigate = useNavigate();

    useEffect(()=>{
        const token = localStorage.getItem("auth-token");
        const userRole = localStorage.getItem("role");
        if(token){
            setIsLogged(true);
            setRole(userRole);
        }
    },[])

    const handleLogout = () =>{
        localStorage.removeItem("auth-token");
        localStorage.removeItem("role");
        setIsLogged(false);
        setRole(null);
        navigate('/home');
    }

    return (
        <div className="NavBar-container">
            <div className='buttons'>
                {isLogged ? (
                    <>
                    {role==='employer' && (
                        <>
                            <SubmitButton msg="Post Job" onClick={()=>navigate('/postJobs')} />
                            <SubmitButton msg="My Jobs" onClick={()=>navigate('/myJobs')} />
                        </>
                    )}
                    {role === 'seeker' && (
                            <>
                                <SubmitButton msg="Search Jobs" onClick={() => navigate('/jobs')} />
                                <SubmitButton msg="My Applications" onClick={() => navigate('/applications')} />
                            </>
                        )}


                        <SubmitButton msg="Profile" onClick={() => navigate('/profile')} />
                        <SubmitButton msg="Logout" onClick={handleLogout} />
                    </>
                ) : (
                    <>
                        <SubmitButton msg="Register" onClick={() => navigate('/register')} />
                        <SubmitButton msg="Login" onClick={() => navigate('/login')} />
                    </>
                )}
            </div>
        </div>
    );

}