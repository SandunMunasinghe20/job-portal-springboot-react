import React,{use, useEffect, useState} from "react";
import SubmitButton from "../../components/submitButton/submitbutton";
import "./applyjob.css";
import { useSearchParams } from "react-router-dom";


export default function ApplyJob(){

    const [searchParams] = useSearchParams();
    const jobId = searchParams.get("id");
    const token = localStorage.getItem("auth-token");

    const [success,setSuccess] = useState("");
    const [err,setErr] = useState("");
    const [jobData,setJobData] = useState("");

    useEffect (() =>{
        const fetchJobDetails = async () => {
        setErr("");
        setSuccess("");
        try{
            const response = await fetch(`http://localhost:8080/api/jobs/findById/${jobId}`,{
                method:'GET',
                headers:{
                    'Authorization': 'Bearer '+ token,
                },
            });
            if(!response.ok){
                setErr("Failed to load Job Details");
                return;
            }
            const data = await response.json();
            console.log("data ",data);
            setJobData(data);

        }catch(e){
            setErr("Unable to connect with the server.");
            return;
        }
    };

    if(jobId){
        fetchJobDetails();
    }
        
    }, [jobId, token]);

    const handlesubmit = async() =>{
        setErr("");
        setSuccess("");

        try{
            
            const response = await fetch("http://localhost:8080/api/applyJobs/",{
                
            })

        }catch(e){
            setErr("Error occured while applying to job");
        }
    }

    return (
        <div className="apply-job-card">

            <h2>{jobData.title}</h2>

            <p>{jobData.description}</p>
            <img src={jobData.image} alt="Company Logo" className="company-image" />
            <p>Job Title: {jobData.jobTitle}</p>
            <p>Company: {jobData.companyName}</p>
            <p>Salary: {jobData.salary}</p>
            <p>Location: {jobData.location}</p>
            
            <input type="file" />
            <SubmitButton msg="Apply" />
        </div>
    );
}