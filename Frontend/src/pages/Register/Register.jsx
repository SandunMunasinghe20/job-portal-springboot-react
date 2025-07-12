import { useState } from 'react'
//import './Register.css'
import GetInput from '../../components/GetInput/GetInput'
import SubmitButton from '../../components/submitButton/submitbutton';
import NavBar from '../../components/HomeComp/NavBar/NavBar';
import { toast } from "react-toastify";


export default function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [selected, setSelected] = useState('seeker');


    const role = localStorage.getItem("role");

    let url = "";

    const handlesubmit = async (e) => {
        e.preventDefault();


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
            }

        } catch (error) {
            toast.error("Error occurred while registering");
        }
    }

    return (
        <>
            <NavBar role={role} />
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center px-4 py-8">
                <div className="w-full max-w-md">
                    <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-8 backdrop-blur-sm">
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                </svg>
                            </div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
                            <p className="text-gray-600">Join our platform to start your career journey</p>
                        </div>

                        <form className="space-y-6" onSubmit={handlesubmit}>
                            <div className="space-y-5">
                                <div className="input-group">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Email address</label>
                                    <GetInput type="email" placeholder="Enter your email" value={email} onChange={setEmail} />
                                </div>
                                <div className="input-group">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                                    <GetInput type="password" placeholder="Create a password" value={password} onChange={setPassword} />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="block text-sm font-medium text-gray-700 mb-2">I am a:</label>
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

                    <div className="text-center mt-6">
                        <p className="text-gray-500 text-sm">
                            Already have an account?
                            <a href="/login" className="text-blue-600 hover:text-blue-700 font-medium ml-1">
                                Sign in
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
