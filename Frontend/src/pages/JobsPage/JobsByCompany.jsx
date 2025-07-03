import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import JobListing from "../../components/JobListing/JobListing";
import NavBar from "../../components/HomeComp/NavBar/NavBar";
import './Jobs.css';


export default function JobsByCompany() {

  const [err, setErr] = useState("");
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const token = localStorage.getItem("auth-token");
  const role = localStorage.getItem("role");

  const fetchJobsByCompany = async () => {
    setLoading(true);
    setErr("");


    try {
      const response = await fetch("http://localhost:8080/api/jobs/findByEmp", {
        method: "GET",
        headers: {
          'Authorization': 'Bearer ' + token,
        },
      });

      if (!response.ok) {
        setErr("Job fetching failed");
        setLoading(false);
        return;
      }
      const data = await response.json();
      console.log("data : ", data);
      setJobs(data);

      setLoading(false);

    } catch (e) {
      setErr("Error occured while fetching your Jobs");
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchJobsByCompany();
  }, [])

  return (
    <><NavBar role={role} />
      <div className="jl-container">
        <div className="jl-header">
          <h1 className="jl-title">Job Board</h1>
          <p className="jl-subtitle">Discover exceptional career opportunities tailored for you</p>
          <div className="jl-stats">
            <div className="jl-stat-item">
              <span className="jl-stat-number">{jobs.length}</span>
              <span>Total Jobs</span>
            </div>
            <div className="jl-stat-item">
              <span className="jl-stat-number">{new Set(jobs.map((job) => job.companyName)).size}</span>
              <span>Companies</span>
            </div>
            <div className="jl-stat-item">
              <span className="jl-stat-number">{new Set(jobs.map((job) => job.location)).size}</span>
              <span>Locations</span>
            </div>
          </div>
        </div>

        {err && <div className="jl-err-message">{err}</div>}

        {loading ? (
          <div className="jl-loading-spinner">
            <div className="jl-spinner"></div>
          </div>
        ) : (
          <JobListing jobs={jobs} navigate={navigate} />
        )}
      </div>
    </>
  );

}