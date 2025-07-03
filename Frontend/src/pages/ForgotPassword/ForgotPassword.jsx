import { useState } from "react";
import validateEmail from "../../services/Service";
import { useNavigate } from "react-router-dom";
//import validatePassword from "../../services/Service";
import GetInput from "../../components/GetInput/GetInput";
import SubmitButton from "../../components/submitButton/submitbutton";
import NavBar from "../../components/HomeComp/NavBar/NavBar";
import "./ForgotPassword.css";


export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [err, setError] = useState("");
    const [success, setSuccess] = useState("");
    const navigate = useNavigate();

    const role = localStorage.getItem("role");


    const handlesubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        try {
            //console.log("starting to get to back");
            const response = await fetch("http://localhost:8080/api/auth/forgot-password", {
                method: 'POST',
                headers: {
                    'Content-Type': 'text/plain'
                },
                body: email
            });

            if (!response.ok) {
                const errMsg = await response.text();
                setError(errMsg);
                return;
            }
            //console.log("res :",response);
            const data = response.text();
            //console.log("data is :",data);

            setSuccess(data);

            /* setTimeout(() => {
                 navigate('/changePass');
             }, 3000);    */                //3 sec



        } catch (e) {
            setError("Something went wrong while sending Password Reset Link");
        }
    }

    return (
        <><NavBar role={role} />
            <div className="forgot-container">
                <form onSubmit={handlesubmit}>
                    <GetInput
                        type="email"
                        value={email}
                        placeholder="Email"
                        onChange={setEmail}
                        required="required"
                    />
                    <br />
                    <SubmitButton msg="Send Link" />
                    {err && <p className="login-message login-error">{err}</p>}
                    {success && <p className="login-message login-success">{success}</p>}
                </form>
            </div>
        </>
    );

}