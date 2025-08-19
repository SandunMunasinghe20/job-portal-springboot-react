import React, { useEffect, useState } from "react";
import SubmitButton from "../../components/submitButton/submitbutton";
import { useNavigate, useSearchParams } from "react-router-dom";
import NavBar from "../../components/HomeComp/NavBar/NavBar";
import { toast } from "react-toastify";

export default function ApplyJob() {
  const [searchParams] = useSearchParams();
  const jobId = searchParams.get("id");
  const token = localStorage.getItem("auth-token");

  const [jobData, setJobData] = useState("");
  const [resume, setResume] = useState(null);

  const navigate = useNavigate();

  const role = localStorage.getItem("role");

  useEffect(() => {
    const fetchJobDetails = async () => {
    
      try {
        const response = await fetch(
          `http://localhost:8080/api/jobs/findById/${jobId}`,
          {
            method: "GET",
            headers: {
              Authorization: "Bearer " + token,
            },
          },
        );
        if (!response.ok) {
          toast.error("Failed to load Job Details");
          return;
        }
        const data = await response.json();
        console.log("data ", data);
        setJobData(data);
      } catch (e) {
        toast.error(`Unable to connect with the server. || ${e}`);
        return;
      }
    };

    if (jobId) {
      fetchJobDetails();
    }
  }, [jobId, token]);

  const handlesubmit = async () => {
    //setErr("");
    //setSuccess("");
    console.log("token when applying to job: ", token);

    if (!resume) {
      toast.error("Please upload a resume.");
      return;
    }

    const maxSize = 10 * 1024 * 1024;

    const allowedTypes = [
      "application/pdf",
      // "application/msword", // .doc
      // "application/vnd.openxmlformats-officedocument.wordprocessingml.document" // .docx
    ];

    if (!allowedTypes.includes(resume.type)) {
      toast.error("Only PDF files are allowed");
      setResume(null);
      return;
    }

    if (resume.size > maxSize) {
      toast.error("File size must be less than 10MB.");
      setResume(null);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("jobId", jobId);
      formData.append("resume", resume);

      const response = await fetch("http://localhost:8080/api/applyJobs/", {
        method: "POST",
        headers: {
          Authorization: "Bearer " + token,
        },
        body: formData,
      });

      if (!response.ok) {
        const errmsg = await response.text();
        console.log("err ", errmsg);
        toast.error(errmsg);

        setTimeout(() => {
          navigate("/jobs");
        }, 1000);

        return;
      }
      const data = await response.text();
      toast.success(data);
      console.log("data : ", data);
      setTimeout(() => {
        navigate("/myApplications");
      }, 1000);
    } catch (e) {
      toast.error(`Error occured while applying to job || ${e}`);
      return;
    }
  };

  const handleFileChange = (e) => {
    setResume(e.target.files[0]);
  };

  return (
    <>
      <NavBar role={role} />
      <div className="min-h-screen p-6 bg-gray-50">
        <div className="max-w-xl p-8 mx-auto bg-white shadow-md rounded-2xl">
          <h2 className="mb-4 text-3xl font-bold text-center text-blue-600">
            {jobData.title}
          </h2>

          <p className="mb-4 text-justify text-gray-700">
            {jobData.description}
          </p>
          <img
            src={jobData.image}
            alt="Company Logo"
            className="object-contain w-32 h-32 mx-auto mb-6"
          />

          <div className="mb-6 space-y-2 text-gray-800">
            <p>
              <span className="font-semibold">Job Title:</span>{" "}
              {jobData.jobTitle}
            </p>
            <p>
              <span className="font-semibold">Company:</span>{" "}
              {jobData.companyName}
            </p>
            <p>
              <span className="font-semibold">Salary:</span> Rs.{" "}
              {jobData.salary}
            </p>
            <p>
              <span className="font-semibold">Location:</span>{" "}
              {jobData.location}
            </p>
          </div>

          <input
            type="file"
            onChange={handleFileChange}
            className="block w-full px-4 py-2 mb-4 border border-gray-300 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200"
          />
          <SubmitButton msg="Apply" onClick={handlesubmit} />
        </div>
      </div>
    </>
  );
}
