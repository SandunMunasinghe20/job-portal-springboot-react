export default function SubmitButton({ msg, onClick }) {
  const isPrimary = msg === "Sign In" || "Register";
  const isGoogle = msg === "Sign in with Google";

  if (isGoogle) {
    return (
      <div className="Edit-profile-button">
        <button
          className="flex items-center justify-center w-full px-4 py-3 space-x-3 font-medium text-gray-700 transition-all duration-200 bg-white border border-gray-300 shadow-sm hover:border-gray-400 rounded-xl hover:shadow-md focus:outline-none focus:ring-4 focus:ring-gray-200"
          onClick={onClick}
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          <span>{msg}</span>
        </button>
      </div>
    );
  }

  return (
    <div className="Edit-profile-button">
      <button
        className={`jl-btn jl-btn-primary w-full ${
          isPrimary
            ? "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-blue-300"
            : "bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md focus:outline-none focus:ring-4 focus:ring-gray-200"
        }`}
        onClick={onClick}
      >
        {msg}
      </button>
    </div>
  );
}
