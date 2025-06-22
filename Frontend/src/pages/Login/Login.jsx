import { useState } from "react";
import './Login.css'
import SubmitButton from "../../components/submitButton/submitbutton";
import EmailInput from "../../components/EmailInput/EmailInput";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handlesubmit = async (e) => {
        e.preventDefault();

        setError("")
        setSuccess("")

        try{
            const response = await fetch("http://localhost:8080/api/auth/login",{
                method:'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body:JSON.stringify( {email, password}),
            });

            if (!response.ok) {
                setError("Login failed")
                return;
            }

            const data = await response.json();

            if(data.token == null){
                setError(data.message)
                return;
            }

            //save token
            localStorage.setItem("auth-token",data.token);
            setSuccess("Login Successful");

        }catch(e){
            //console.log("Error occured while logging");
            setError("Login failed. Try again");
        }
    };

    return (
        <div className="login-container">
            <h1>Login</h1>
            <form className="login-form" onSubmit={handlesubmit}>
                <div className="input-group">
                    <EmailInput type="email" value={email} onChange={setEmail} placeholder="Email" />
                </div>
                <div className="input-group">
                    <EmailInput type="password" value={password} onChange={setPassword} placeholder="Password" />
                </div>
                <SubmitButton msg="Login"/>
                             
                {error && <p className="login-message login-error">{error}</p>}
                {success && <p className="login-message login-success">{success}</p>}

                <p className="forgot-password"><a href="http://localhost:8080/api/auth/forgot-password">Forgot Password? </a></p>
            </form>
        </div>
    );
}

export default Login;