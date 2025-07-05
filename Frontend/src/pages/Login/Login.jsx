import { useState, useEffect } from "react";
import './Login.css'
import SubmitButton from "../../components/submitButton/submitbutton";
import GetInput from "../../components/GetInput/GetInput";
import { Link, useNavigate } from "react-router-dom";
import NavBar from "../../components/HomeComp/NavBar/NavBar";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [isDarkMode, setIsDarkMode] = useState(false);

    const role = localStorage.getItem("role");


    const navigate = useNavigate();


    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            setIsDarkMode(savedTheme === 'dark');
        } else {
            // Check system preference
            setIsDarkMode(window.matchMedia('(prefers-color-scheme: dark)').matches);
        }
    }, []);


    useEffect(() => {
        if (isDarkMode) {
            document.body.classList.add('dark-theme');
        } else {
            document.body.classList.remove('dark-theme');
        }
    }, [isDarkMode]);

    const toggleTheme = () => {
        const newTheme = !isDarkMode;
        setIsDarkMode(newTheme);
        localStorage.setItem('theme', newTheme ? 'dark' : 'light');
    };

    const handlesubmit = async (e) => {
        e.preventDefault();

        setError("")
        setSuccess("")

        try {
            const response = await fetch("http://localhost:8080/api/auth/login", {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                setError("Login failed")
                return;
            }

            const data = await response.json();

            if (data.token == null) {
                setError(data.message)
                return;
            }

            //save token
            localStorage.setItem("auth-token", data.token);
            localStorage.setItem("role", data.role);
            console.log("Role ", data.role);
            setSuccess("Login Successful");

            setTimeout(() => {
                const role = localStorage.getItem("role");
                if (role == 'admin') {
                    navigate('/adminHome');
                } else
                    navigate('/home');
            }, 1000);

        } catch (e) {
            //console.log("Error occured while logging");
            setError("Login failed. Try again");
        }
    };

    return (
        <><NavBar role={role} />
            <div className="login-container">

                <button
                    className="theme-toggle"
                    onClick={toggleTheme}
                    aria-label="Toggle theme"
                >
                    {isDarkMode ? '☀️' : '🌙'}
                </button>

                <h1>Login</h1>
                <form className="login-form" onSubmit={handlesubmit}>
                    <div className="input-group">
                        <GetInput type="email" value={email} onChange={setEmail} placeholder="Email" />
                    </div>
                    <div className="input-group">
                        <GetInput type="password" value={password} onChange={setPassword} placeholder="Password" />
                    </div>
                    <SubmitButton msg="Login" />

                    {error && <p className="login-message login-error">{error}</p>}
                    {success && <p className="login-message login-success">{success}</p>}

                    <p className="forgot-password">
                        <Link to="/forgotPassword" >Forgot Password? </Link>
                    </p>
                </form>
            </div>
        </>
    );
}

export default Login;