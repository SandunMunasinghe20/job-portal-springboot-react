import { useState, useEffect } from "react";
//import './Login.css'
import SubmitButton from "../../components/submitButton/submitbutton";
import GetInput from "../../components/GetInput/GetInput";
import { Link, useNavigate } from "react-router-dom";
import NavBar from "../../components/HomeComp/NavBar/NavBar";
import { toast } from "react-toastify";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [viewPass, setViewPass] = useState(false);
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

    /*
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
        };*/

    const handlesubmit = async (e) => {
        e.preventDefault();

        //setError("")
        //setSuccess("")

        try {
            const response = await fetch("http://localhost:8080/api/auth/login", {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                toast.error("Login failed")
                return;
            }

            const data = await response.json();

            if (data.token == null) {
                toast.error(data.message)
                return;
            }

            //save token
            localStorage.setItem("auth-token", data.token);
            localStorage.setItem("role", data.role);
            console.log("Role ", data.role);
            //setSuccess("Login Successful");
            toast.success('Login Successful');

            setTimeout(() => {
                const role = localStorage.getItem("role");
                if (role == 'admin') {
                    navigate('/adminHome');
                } else
                    navigate('/home');
            }, 1000);

        } catch (e) {
            //console.log("Error occured while logging");
            //setError("Login failed. Try again");
            toast.error("Login failed. Try again");
        }
    };

    return (
        <>
            <NavBar role={role} />
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center px-4 py-8">
                <div className="w-full max-w-md">
                    <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-8 backdrop-blur-sm">
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
                            <p className="text-gray-600">Sign in to continue your career journey</p>
                        </div>

                        <form className="space-y-6" onSubmit={handlesubmit}>
                            <div className="space-y-5">
                                <div className="relative">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Email address</label>
                                    <div className="relative">
                                        <GetInput
                                            type="email"
                                            value={email}
                                            onChange={setEmail}
                                            // className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                                            placeholder="Enter your email"
                                            required
                                        />
                                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                                <div className="relative">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                                    <div className='relative'>
                                        <GetInput type={viewPass ? "text" : "password"} placeholder="Create a password" value={password} onChange={setPassword} />
                                        <button
                                            type="button"
                                            onClick={() => setViewPass(!viewPass)}
                                            className="absolute right-2 top-2/4 -translate-y-2/4 text-gray-500 hover:text-gray-700"
                                            tabIndex={-1} // so it doesn't focus on tab
                                        >
                                            {viewPass ? (
                                                // Eye open icon
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="h-5 w-5"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                                    />
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                                    />
                                                </svg>
                                            ) : (
                                                // Eye closed icon
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="h-5 w-5"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7a9.965 9.965 0 012.223-3.364M6.22 6.22l11.314 11.314M9.88 9.88a3 3 0 104.243 4.243"
                                                    />
                                                </svg>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <SubmitButton msg="Sign In" />

                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-gray-200"></div>
                                    </div>
                                    <div className="relative flex justify-center text-sm">
                                        <span className="px-4 bg-white text-gray-500 font-medium">Or continue with</span>
                                    </div>
                                </div>

                                <SubmitButton msg="Sign in with Google" />
                            </div>

                            <div className="text-center pt-2">
                                <Link
                                    to="/forgotPassword"
                                    className="text-sm text-blue-600 hover:text-blue-700 font-medium hover:underline transition-all duration-200"
                                >
                                    Forgot your password?
                                </Link>
                            </div>
                        </form>
                    </div>

                    <div className="text-center mt-6">
                        <p className="text-gray-500 text-sm">
                            Don't have an account?
                            <Link to="/register" className="text-blue-600 hover:text-blue-700 font-medium ml-1">
                                Sign up
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Login;