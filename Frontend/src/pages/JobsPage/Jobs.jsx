import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import JobListing from "../../components/JobListing/JobListing";
import NavBar from "../../components/HomeComp/NavBar/NavBar";
import { toast } from "react-toastify";

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  //const [error, toast.error] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const role = localStorage.getItem("role");
  const token = localStorage.getItem("auth-token");

  const fetchJobs = async () => {
    setLoading(true);

    if (!token) {
      toast.error("Please login first.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/jobs/all", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });

      if (!response.ok) {
        const errmsg = await response.text();
        toast.error(errmsg);
        setLoading(false);
        return;
      }

      const data = await response.json();
      setJobs(data);
      console.log("data ", data);
    } catch (err) {
      toast.error(`Error occurred while fetching jobs || ${err}`);
      return;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  return (
    <>
      <NavBar role={role} />

      {loading ? (
        <div className="jl-loading-spinner">
          <div className="jl-spinner"></div>
        </div>
      ) : (
        <JobListing jobs={jobs} navigate={navigate} />
      )}
    </>
  );
}
