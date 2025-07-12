import { useEffect, useState } from "react";
import GetInput from '../../components/GetInput/GetInput';
import SubmitButton from '../../components/submitButton/submitbutton';
import NavBar from "../../components/HomeComp/NavBar/NavBar";
//import './PostJobs.css';
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";


export default function PostJobs() {

  const navigate = useNavigate();

  const [jobTitle, setJobTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [location, setLocation] = useState('');
  const [salary, setSalary] = useState('');
  const [jobType, setJobType] = useState("");
  const [skillsRequired, setSkillsRequired] = useState("");


  //const [err, toast.error] = useState("");
  //const [success, toast.success] = useState("");
  const [posting, setPosting] = useState("");

  const [searchParams] = useSearchParams();
  const jobId = searchParams.get("id");
  console.log("search param job id is : ", jobId);


  //token
  const token = localStorage.getItem("auth-token");
  const role = localStorage.getItem("role");

  let url = "";
  {/*edit or add based on search parameters */ }
  if (!jobId) {
    url = "http://localhost:8080/api/jobs/add";
  } else {
    url = "http://localhost:8080/api/jobs/update"

  }


  const handleSubmit = async (e) => {
    e.preventDefault();


    setPosting("");


    let method;
    if (jobId) {
      method = 'PUT'  //for update
    } else {
      method = 'POST'
    }

    try {

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({
          jobTitle, jobDescription, location, salary: Number(salary),
          jobType, id: jobId, skillsRequired: skillsRequired
        }),

      });
      console.log("data sending ", body);
      //no existing job id ,so this is an adding job
      if (!jobId) {
        if (!response.ok) {
          toast.error("Failed to add Job.Try again");
        }

        const data = await response.text();
        console.log("dresp received", data);
        toast.success(data);
        //navigate('/myJobs');
      } else {
        //updating job
        if (!response.ok) {
          const data = await response.text();
          toast.error(data);
        }

        const data = await response.text();
        console.log("data ", data);
        toast.success(data);

      }
      navigate('/myJobs');

    } catch (e) {
      toast.error("Failed to connect with backend.Try again");
    }
  }

  const fetchData = async () => {
    if (jobId) {
      const res = await fetch(`http://localhost:8080/api/jobs/findById/${jobId}`, {
        method: "GET",
        headers: {
          'Authorization': 'Bearer ' + token,
        },
      });

      if (!res.ok) {
        toast.error("Error occured while fetching Job Data");
        return;
      }
      const jobData = await res.json();
      //set data
      setJobTitle(jobData.jobTitle);
      setJobDescription(jobData.jobDescription);
      setLocation(jobData.location);
      setSalary(jobData.salary);
      setJobType(jobData.jobType);
      setSkillsRequired(jobData.skillsRequired);

    }
  }
  useEffect(() => {
    fetchData();
  }, [jobId, token])

  return (
    <><NavBar role={role} />
      <div className="job-post-controller">
        <GetInput
          type="text"
          placeholder="Job Title"
          value={jobTitle}
          onChange={setJobTitle}
          required
        />
        <br />

        <GetInput
          type="text"
          placeholder="Job Description"
          value={jobDescription}
          onChange={setJobDescription}
          required
        />
        <br />
        <GetInput
          type="text"
          placeholder="Location"
          value={location}
          onChange={setLocation}
          required
        />
        <br />

        <GetInput
          type="number"
          placeholder="Salary"
          value={salary}
          onChange={setSalary}
          required
        />
        <br />



        <GetInput
          type="text"
          placeholder="Job Type"
          value={jobType}
          onChange={setJobType}
          required
        />
        <GetInput
          type="text"
          placeholder="Skills Required"
          value={skillsRequired}
          onChange={setSkillsRequired}
          required
        />

        <br />
        {posting && <p>{posting}</p>}

        {/*edit or update button */}
        {!jobId && <SubmitButton msg="Post Job" onClick={handleSubmit} />}
        {jobId && <SubmitButton msg="Update Job" onClick={handleSubmit} />}

      </div>
    </>

  );

}