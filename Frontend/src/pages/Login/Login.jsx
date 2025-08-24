import { useState } from "react";
import SubmitButton from "../../components/submitButton/submitbutton";
import GetInput from "../../components/GetInput/GetInput";
import { Link, useNavigate } from "react-router-dom";
import NavBar from "../../components/HomeComp/NavBar/NavBar";
import { toast } from "react-toastify";
import GoogleLoginButton from "../../components/GoogleLoginButton/GoogleLoginButton";

function Login() {
  const API_URL = import.meta.env.VITE_API_URL;
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [viewPass, setViewPass] = useState(false);
 // const [isDarkMode, setIsDarkMode] = useState(false);

  const role = localStorage.getItem("role");

  const navigate = useNavigate();
  

 

  // Handle Google login success
  const handleGoogleSuccess = async (credential) => {
    try {
      const response = await fetch(
        `${API_URL}/auth/google-login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: credential }),
        },
      );

      const data = await response.json();

      if (response.ok && data.token) {
        localStorage.setItem("auth-token", data.token);
        localStorage.setItem("role", data.role);
        localStorage.setItem("id", data.id);

        toast.success("Google login successful");

        setTimeout(() => {
          const role = localStorage.getItem("role");
          if (role === "admin") {
            navigate("/adminHome");
          } else {
            navigate("/home");
          }
        }, 1000);
      } else {
        toast.error(data.message || "Google login failed");
      }
    } catch (error) {
      toast.error("Google login error: " + error.message);
    }
  };

  // Handle Google login failure
  const handleGoogleError = (error) => {
    toast.error(error);
  };

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
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        toast.error("Login failed");
        return;
      }

      const data = await response.json();

      if (data.token == null) {
        toast.error(data.message);
        return;
      }

      //save token
      localStorage.setItem("auth-token", data.token);
      localStorage.setItem("role", data.role);
      localStorage.setItem("id", data.id);
      console.log("id is : ", data.id);
      console.log("Role ", data.role);
      //setSuccess("Login Successful");
      toast.success("Login Successful");

      setTimeout(() => {
        const role = localStorage.getItem("role");
        if (role == "admin") {
          navigate("/adminHome");
        } else navigate("/home");
      }, 1000);
    } catch (e) {
      //console.log("Error occured while logging");
      //setError("Login failed. Try again");
      toast.error(`Login failed. Try again || ${e}`);
    }
  };

  return (
    <>
      <NavBar role={role} />
      <div className="flex items-center justify-center min-h-screen px-4 py-8 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="w-full max-w-md">
          <div className="p-8 bg-white border border-gray-100 shadow-2xl rounded-3xl backdrop-blur-sm">
            <div className="mb-8 text-center">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <h1 className="mb-2 text-3xl font-bold text-gray-900">
                Welcome Back
              </h1>
              <p className="text-gray-600">
                Sign in to continue your career journey
              </p>
            </div>

            <form className="space-y-6" onSubmit={handlesubmit}>
              <div className="space-y-5">
                <div className="relative">
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Email address
                  </label>
                  <div className="relative">
                    <GetInput
                      type="email"
                      value={email}
                      onChange={setEmail}
                      // className="w-full px-4 py-3 transition-all duration-200 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 focus:bg-white"
                      placeholder="Enter your email"
                      required
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      <svg
                        className="w-5 h-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="relative">
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <div className="relative">
                    <GetInput
                      type={viewPass ? "text" : "password"}
                      placeholder="Create a password"
                      value={password}
                      onChange={setPassword}
                    />
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

              <div className="space-y-4">
                <SubmitButton msg="Sign In" />

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 font-medium text-gray-500 bg-white">
                      Or continue with
                    </span>
                  </div>
                </div>

                <GoogleLoginButton
                  onLoginSuccess={handleGoogleSuccess}
                  onLoginError={handleGoogleError}
                />
              </div>

              <div className="pt-2 text-center">
                <Link
                  to="/forgotPassword"
                  className="text-sm font-medium text-blue-600 transition-all duration-200 hover:text-blue-700 hover:underline"
                >
                  Forgot your password?
                </Link>
              </div>
            </form>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Don't have an account?
              <Link
                to="/register"
                className="ml-1 font-medium text-blue-600 hover:text-blue-700"
              >
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
