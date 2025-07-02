import { useState } from "react";
import GetInput from '../../components/GetInput/GetInput';
import SubmitButton from '../../components/submitButton/submitbutton';
import './PostJobs.css';

export default function PostJobs(){
    const [jobTitle, setJobTitle] = useState('');
    const [jobDescription, setJobDescription] = useState('');
    const [location, setLocation] = useState('');
    const [salary, setSalary] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [jobType,setJobType] = useState("");
    
    const [err,setErr] = useState("");
    const [success,setSuccess] = useState("");
    const [posting,setPosting] = useState("");

    //token
    const token = localStorage.getItem("auth-token");

    const handleSubmit = async (e) => {
        e.preventDefault();

        setErr("");
        setSuccess("");
        setPosting("");

        try{
            const response = await fetch("http://localhost:8080/api/jobs/add",{
                method : 'POST',
                headers:{
                    'Content-Type':'application/json',
                    'Authorization':'Bearer '+token
                },
                body : JSON.stringify({
                    jobTitle,jobDescription,location,salary:Number(salary),
                    companyName
                }),
            });

            if(!response.ok){
                setErr("Failed to add Job.Try again");
            }

            const data = await response.text();
            console.log("data ",data);
            setSuccess(data);

        }catch(e){
            setErr("Failed to connect with backend.Try again");
        }
    }

    return (
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

      <br />
      {err && <p style={{ color: "red" }}>{err}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
      {posting && <p>{posting}</p>}


        <SubmitButton msg="Post Job" onClick = {handleSubmit} />

    </div>

    );

}