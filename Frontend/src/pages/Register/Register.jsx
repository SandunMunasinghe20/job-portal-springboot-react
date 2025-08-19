import { useState } from 'react'
//import './Register.css'
import GetInput from '../../components/GetInput/GetInput'
import SubmitButton from '../../components/submitButton/submitbutton';
import NavBar from '../../components/HomeComp/NavBar/NavBar';
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";


export default function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [viewPass, setViewPass] = useState(false);
    const [selected, setSelected] = useState('seeker');

    const navigate = useNavigate();

    const role = localStorage.getItem("role");

    let url = "";

    const handlesubmit = async (e) => {
        e.preventDefault();
        if (!email || !password) {
            toast.error("Please fill in both email and password before registering.");
            return;
        }


        try {
            if (selected == 'seeker') {
                url = "http://localhost:8080/api/auth/register-seeker"
            } else {
                url = "http://localhost:8080/api/auth/register-employer"
            }
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({ email, password }),

            });

            console.log("data sending back is: ", { email, password });
            // get resp entity string msg
            const msg = await response.text();
            console.log(msg);

            if (!response.ok) {
                toast.error(msg);
                return;
            }

            if (msg) {
                toast.success(msg);
                navigate("/login");
            }

        } catch (error) {
            toast.error("Error occurred while registering");
        }
    }

    return (
        <>
            <NavBar role={role} />
            <div className="flex items-center justify-center min-h-screen px-4 py-8 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
                <div className="w-full max-w-md">
                    <div className="p-8 bg-white border border-gray-100 shadow-2xl rounded-3xl backdrop-blur-sm">
                        <div className="mb-8 text-center">
                            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                </svg>
                            </div>
                            <h1 className="mb-2 text-3xl font-bold text-gray-900">Create Account</h1>
                            <p className="text-gray-600">Join our platform to start your career journey</p>
                        </div>

                        <form className="space-y-6" onSubmit={handlesubmit}>
                            <div className="space-y-5">
                                <div className="input-group">
                                    <label className="block mb-2 text-sm font-medium text-gray-700">Email address</label>
                                    <GetInput type="email" placeholder="Enter your email" value={email} onChange={setEmail} />
                                </div>
                                <div className="input-group">
                                    <label className="block mb-2 text-sm font-medium text-gray-700">Password</label>
                                    <div className='relative'>
                                        <GetInput type={viewPass ? "text" : "password"} placeholder="Create a password" value={password} onChange={setPassword} />
                                        <button
                                            type="button"
                                            onClick={() => setViewPass(!viewPass)}
                                            className="absolute text-gray-500 right-2 top-2/4 -translate-y-2/4 hover:text-gray-700"
                                            tabIndex={-1} // so it doesn't focus on tab
                                        >
                                            {viewPass ? (
                                                // Eye open icon
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="w-5 h-5"
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
                                                    className="w-5 h-5"
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

                            <div className="space-y-3">
                                <label className="block mb-2 text-sm font-medium text-gray-700">I am a:</label>
                                <div className="flex space-x-3">
                                    <button
                                        type='button'
                                        className={`flex-1 py-3 px-4 rounded-xl border-2 transition-all duration-200 font-medium ${selected === 'employer'
                                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                                            : 'border-gray-300 bg-white text-gray-600 hover:border-gray-400'
                                            }`}
                                        onClick={() => setSelected('employer')}
                                    >
                                        Employer
                                    </button>
                                    <button
                                        type='button'
                                        className={`flex-1 py-3 px-4 rounded-xl border-2 transition-all duration-200 font-medium ${selected === 'seeker'
                                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                                            : 'border-gray-300 bg-white text-gray-600 hover:border-gray-400'
                                            }`}
                                        onClick={() => setSelected('seeker')}
                                    >
                                        Job Seeker
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <SubmitButton msg="Register" />
                            </div>
                        </form>
                    </div>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-500">
                            Already have an account?
                            <a href="/login" className="ml-1 font-medium text-blue-600 hover:text-blue-700">
                                Sign in
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
