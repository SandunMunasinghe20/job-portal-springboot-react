import { useState, useEffect } from "react";
import JobListing from "../../components/JobListing/JobListing";
import NavBar from "../../components/HomeComp/NavBar/NavBar";
import { toast } from "react-toastify";
import { useRef } from "react";

export default function Jobs() {
  const API_URL = import.meta.env.VITE_API_URL;

  const [jobs, setJobs] = useState([]);
  //const [error, toast.error] = useState("");
  const [loading, setLoading] = useState(true);

  const hasFetched = useRef(false);

  const role = localStorage.getItem("role");
  const token = localStorage.getItem("auth-token");

  const fetchJobs = async () => {
    setLoading(true);

    if (!token) {
      toast.error("Please login first.");
      setLoading(false);
      hasFetched.current(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/jobs/all`, {
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
    // stop re render
    if (hasFetched.current) return;
    hasFetched.current = true;
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
        <JobListing jobsRe={jobs} />
      )}
    </>
  );
}
