import { useState } from 'react'
import './Register.css'
import GetInput from '../../components/GetInput/GetInput'
import SubmitButton from '../../components/submitButton/submitbutton';

export default function Register(){
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [err, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handlesubmit = async (e) => {
        e.preventDefault();
        
        setError("")
        setSuccess("")

        try {
            const response = await fetch("http://localhost:8080/api/auth/register-seeker",{
                method:'POST',
                headers:{
                    "Content-Type":"application/json"
                },
                body: JSON.stringify({email, password}),
            });

            // get resp entity string msg
            const msg = await response.text();
            
            if(!response.ok){
                setError(msg || "Registration failed.");
                return;
            }
            

            if(msg){
                setSuccess(msg);
            }

        } catch (error) {
            setError("Error occurred while registering");
        }
    }

    return (
        <div className="register-container">
            <h1>Register</h1>
            <form className="register-form" onSubmit={handlesubmit}>
                <div className="input-group">
                    <GetInput type="email" placeholder="Email" value={email} onChange={setEmail} />
                </div>
                <div className="input-group">
                    <GetInput type="password" placeholder="Password" value={password} onChange={setPassword} />
                </div>
                <SubmitButton msg="Register" />
                
                {err && <p className="register-message register-error">{err}</p>}
                {success && <p className="register-message register-success">{success}</p>}
                <p className="already-member"><a href="http://localhost:5173/login">Already a member? </a></p>
            </form>
        </div>
    );
}
