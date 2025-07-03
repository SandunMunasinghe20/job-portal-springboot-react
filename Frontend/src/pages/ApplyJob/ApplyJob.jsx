import React, { use, useEffect, useState } from "react";
import SubmitButton from "../../components/submitButton/submitbutton";
import "./applyjob.css";
import { useSearchParams } from "react-router-dom";
import NavBar from "../../components/HomeComp/NavBar/NavBar";

export default function ApplyJob() {

    const [searchParams] = useSearchParams();
    const jobId = searchParams.get("id");
    const token = localStorage.getItem("auth-token");

    const [success, setSuccess] = useState("");
    const [err, setErr] = useState("");
    const [jobData, setJobData] = useState("");
    const [resume, setResume] = useState(null);

    const role = localStorage.getItem("role");

    useEffect(() => {

        const fetchJobDetails = async () => {
            setErr("");
            setSuccess("");
            try {
                const response = await fetch(`http://localhost:8080/api/jobs/findById/${jobId}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': 'Bearer ' + token,
                    },
                });
                if (!response.ok) {
                    setErr("Failed to load Job Details");
                    return;
                }
                const data = await response.json();
                console.log("data ", data);
                setJobData(data);

            } catch (e) {
                setErr("Unable to connect with the server.");
                return;
            }
        };

        if (jobId) {
            fetchJobDetails();
        }

    }, [jobId, token]);

    const handlesubmit = async () => {
        setErr("");
        setSuccess("");
        console.log("token when applying to job: ", token);

        if (!resume) {
            setErr("Please upload a resume.");
            return;
        }

        try {

            const formData = new FormData();
            formData.append("jobId", jobId);
            formData.append("resume", resume);

            const response = await fetch("http://localhost:8080/api/applyJobs/", {
                method: "POST",
                headers: {
                    'Authorization': 'Bearer ' + token,
                },
                body: formData,

            });

            if (!response.ok) {
                const errmsg = await response.text();
                setErr(errmsg);
                return;
            }
            const data = await response.text();
            setSuccess(data);
            console.log("data : ", data);


        } catch (e) {
            setErr("Error occured while applying to job");
            return;
        }
    };

    const handleFileChange = (e) => {
        setResume(e.target.files[0]);
    }

    return (
        <><NavBar role={role} />
            <div className="apply-job-card">

                <h2>{jobData.title}</h2>

                <p>{jobData.description}</p>
                <img src={jobData.image} alt="Company Logo" className="company-image" />
                <p>Job Title: {jobData.jobTitle}</p>
                <p>Company: {jobData.companyName}</p>
                <p>Salary: {jobData.salary}</p>
                <p>Location: {jobData.location}</p>

                <input type="file" onChange={handleFileChange} />
                <SubmitButton msg="Apply" onClick={handlesubmit} />
                {err && <p style={{ color: "red", marginTop: "10px" }}>{err}</p>}
                {success && <p style={{ color: "green", marginTop: "10px" }}>{success}</p>}

            </div>
        </>
    );
}