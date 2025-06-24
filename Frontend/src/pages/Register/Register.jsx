import { useState } from 'react'
import './Register.css'
import GetInput from '../../components/GetInput/GetInput'
import SubmitButton from '../../components/submitButton/submitbutton';

export default function Register(){
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [err, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [selected,setSelected]=useState('seeker');

    let url="";

    const handlesubmit = async (e) => {
        e.preventDefault();
        
        setError("")
        setSuccess("")

        try {
            if(selected=='seeker'){
                url = "http://localhost:8080/api/auth/register-seeker"
            }else{
                url = "http://localhost:8080/api/auth/register-employer"
            }
            const response = await fetch(url,{
                method:'POST',
                headers:{
                    "Content-Type":"application/json"
                },
                body: JSON.stringify({email, password}),
                    
            });
            
            console.log("data sending back is: ",{email,password});
            // get resp entity string msg
            const msg = await response.text();
            console.log(msg);

            if(!response.ok){
                setError(msg);
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

                <div className="toggle-buttons">
                <button
                    type='button'
                    className={`role-btn ${selected === 'employer' ? 'active' : ''}`}
                    onClick={() => setSelected('employer')}
                >
                    Employer
                </button>
                <button
                    type='button'
                    className={`role-btn ${selected === 'seeker' ? 'active' : ''}`}
                    onClick={() => setSelected('seeker')}
                >
                    Job Seeker
                </button>
                </div>


                <SubmitButton msg="Register" />
                
                {err && <p className="register-message register-error">{err}</p>}
                {success && <p className="register-message register-success">{success}</p>}
                <p className="already-member"><a href="http://localhost:5173/login">Already a member? </a></p>
            </form>
        </div>
    );
}
