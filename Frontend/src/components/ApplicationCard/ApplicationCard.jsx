
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './ApplicationCard.css';
import SubmitButton from '../submitButton/submitbutton';

export default function ApplicationCard({ applications }) {

    const role = localStorage.getItem("role");
    const token = localStorage.getItem("auth-token");
    console.log("token is ", token);
    console.log("role : ", role);


    const [err, setErr] = useState("");
    const [success, setSuccess] = useState("");
    const [app, setApp] = useState();
    const [isEditClicked, setIsEditClicked] = useState(false);
    const [resume, setResume] = useState(null);

    const navigate = useNavigate();


    const handleDelete = async ({ app }) => {
        console.log("job id in delete: ", app.id);
        try {
            const response = await fetch(`http://localhost:8080/api/applyJobs/delete/${app.id}`, {
                method: "DELETE",
                headers: {
                    'Authorization': 'Bearer ' + token,
                },
            });
            if (!response.ok) {
                setErr("Error occured while deleting Job Application");
                console.log("Error occured while deleting Job Application");
                return;
            }
            const data = await response.text();
            console.log("data ", data);
            setSuccess(data);
            navigate(0);

        } catch (error) {
            setErr("Error occured while connecting to server.");
            console.log("Error occured while connecting to server.")
            return;
        }
    }
    const handleEditClicked = () => {
        //make upload resume data visible
        setIsEditClicked(true);
    }


    const handleEdit = async ({ app }) => {

        if (!resume) {
            setErr("Please upload a resume.");
            return;
        }

        const maxSize = 10 * 1024 * 1024;

        const allowedTypes = [
            "application/pdf",
            "application/msword", // .doc
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document" // .docx
        ];

        if (!allowedTypes.includes(resume.type)) {
            setErr("Only PDF, DOC or DOCX files are allowed");
            setResume(null);
            return;
        }

        if (resume.size > maxSize) {
            setErr("File size must be less than 10MB.");
            setResume(null);
            return;
        }

        try {

            const formData = new FormData();
            formData.append("id", app.id);
            formData.append("resume", resume);

            const response = await fetch(`http://localhost:8080/api/applyJobs/update/${app.id}`, {
                method: "PUT",
                headers: {
                    'Authorization': 'Bearer ' + token,
                },
                body: formData,

            });

            if (!response.ok) {
                const errmsg = await response.text();
                console.log("err ", errmsg);
                setErr(errmsg);
                return;
            }

            const data = await response.text();
            setSuccess(data);
            console.log("data : ", data);

            setResume(null);

            setTimeout(() => {
                navigate(0);
            }, 1000);

        } catch (e) {
            setErr("Error occured while updating your Job Application");
            return;
        }
    };

    const handleFileChange = (e) => {
        setResume(e.target.files[0]);
    }


    return (
        <div className='ApplicationCard-container'>
            {applications.map((app, index) => (
                <div key={index} className="application-item">
                    <p><strong>Job Title:</strong> {app.jobTitle}</p>
                    <p><strong>Company:</strong> {app.companyName}</p>
                    <p>
                        <strong>Resume:</strong>{' '}
                        <a href={app.resume} target="_blank" rel="noopener noreferrer">
                            View Resume
                        </a>
                    </p>
                    <p><strong>Status:</strong> {app.status}</p>
                    <p><strong>Applied At:</strong> {new Date(app.appliedAt).toLocaleString()}</p>
                    {(role === 'seeker') || (role === 'admin') && <button className='delete-button' onClick={() => { handleDelete({ app }) }}>Delete</button>}
                    {role === 'seeker' && <button className='edit-button' onClick={() => handleEditClicked()}>Edit</button>}
                    {role === 'employer' && <button className='edit-button' onClick={() => handleApprove}>Approve</button>}

                    {isEditClicked && <input type='file' onChange={handleFileChange}></input>}
                    {isEditClicked && <SubmitButton msg="Update" onClick={() => handleEdit({ app })} />}


                    {err && <p style={{ color: "red", marginTop: "10px" }}>{err}</p>}
                    {success && <p style={{ color: "green", marginTop: "10px" }}>{success}</p>}
                </div>
            ))}
        </div>
    );
}
