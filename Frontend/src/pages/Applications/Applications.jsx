import  { useState, useEffect } from "react";
import ApplicationCard from "../../components/ApplicationCard/ApplicationCard";
import NavBar from "../../components/HomeComp/NavBar/NavBar";

//import './Applications.css';
import { toast } from "react-toastify";
import Spinner from "../../components/Spinner/Spinner";

export default function Applications() {
  const [applications, setApplications] = useState([]);
  //const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("auth-token");
  const role = localStorage.getItem("role");

  let url;
  if (role === "seeker")
    url = "http://localhost:8080/api/applyJobs/myApplications";
  else if (role == "admin")
    url = "http://localhost:8080/api/admin/applications";
  else url = "http://localhost:8080/api/applyJobs/view";

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
          toast.error(errorMsg);
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

    fetchApplications();
  }, []);

  return (
    <>
      {" "}
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
