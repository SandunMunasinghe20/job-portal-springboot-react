import { useEffect, useState  } from "react";
import { useNavigate } from "react-router-dom";
import JobListing from "../../components/JobListing/JobListing";
import NavBar from "../../components/HomeComp/NavBar/NavBar";
import { toast } from "react-toastify";
import Spinner from "../../components/Spinner/Spinner";

export default function JobsByCompany() {
  const API_URL = import.meta.env.VITE_API_URL;

  
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const token = localStorage.getItem("auth-token");
  const role = localStorage.getItem("role");

  const fetchJobsByCompany = async () => {
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/jobs/findByEmp`, {
        method: "GET",
        headers: {
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
      console.log("data : ", data);
      setJobs(data);

      setLoading(false);
    } catch (e) {
      toast.error(`Error occured while fetching your Jobs`);
      console.log(e);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobsByCompany();
  }, []);

  return (
    <>
      <NavBar role={role} />

      {loading ? <Spinner /> : <JobListing jobsRe={jobs}/>}
    </>
  );
}
