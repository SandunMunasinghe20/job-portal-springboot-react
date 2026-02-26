import { useState, useEffect, useRef } from "react";
import ApplicationCard from "../../components/ApplicationCard/ApplicationCard";
import NavBar from "../../components/HomeComp/NavBar/NavBar";

//import './Applications.css';
import { toast } from "react-toastify";
import Spinner from "../../components/Spinner/Spinner";

export default function Applications() {
  const API_URL = import.meta.env.VITE_API_URL;

  const [applications, setApplications] = useState([]);
  //const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("auth-token");
  const role = localStorage.getItem("role");

  const hasFetched = useRef(false);

  let url;
  if (role === "seeker") url = `${API_URL}/applyJobs/myApplications`;
  else if (role == "admin") url = `${API_URL}/admin/applications`;
  else url = `${API_URL}/applyJobs/view`;

  useEffect(() => {
    const fetchApplications = async () => {
      //setErr("");
      setLoading(true);

      try {
        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorMsg = await response.text();
          if (errorMsg != "No Jobs found") {
            toast.error(errorMsg);
          }
          setLoading(false);
          return;
        }

        const data = await response.json();
        console.log("data ", data);
        setApplications(data);
        setLoading(false);
      } catch (error) {
        toast.error("Error connecting to server");
        console.error("Error fetching applications:", error);
        setLoading(false);
      }
    };

    if (hasFetched.current) return;
    hasFetched.current = true;

    fetchApplications();
  }, []);

  return (
    <>
      <NavBar role={role} />
      <div className="min-h-screen px-4 py-10 bg-gray-50 sm:px-6 lg:px-8">
        <h1 className="mb-8 text-3xl font-extrabold text-center text-blue-600">
          {role === "seeker"
            ? "My Applications"
            : role === "employer"
              ? "Received Applications"
              : role === "admin"
                ? "All Applications"
                : "Applications"}
        </h1>

        {loading && <Spinner />}

        <ApplicationCard applications={applications} />
      </div>
    </>
  );
}
