
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
//import './ApplicationCard.css';
import SubmitButton from '../submitButton/submitbutton';
import { fetchFromBackend } from '../../services/Service';
import { toast } from "react-toastify";


export default function ApplicationCard({ applications }) {

    const role = localStorage.getItem("role");
    const token = localStorage.getItem("auth-token");
    console.log("token is ", token);
    console.log("role : ", role);


    //const [err, toast.error] = useState("");
    //const [success, toast.success] = useState("");
    const [app, setApp] = useState();
    const [isEditClicked, setIsEditClicked] = useState(false);
    const [resume, setResume] = useState(null);
    const [editAppId, setEditAppId] = useState(null);

    const [confirmationAppId, setConfirmationAppId] = useState(null);
    const [actionType, setActionType] = useState(""); // APPROVED/REJECTED


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
                toast.error("Error occured while deleting Job Application");
                console.log("Error occured while deleting Job Application");
                return;
            }
            const data = await response.text();
            console.log("data ", data);
            toast.success(data);
            navigate(0);

        } catch (error) {
            toast.error("Error occured while connecting to server.");
            console.log("Error occured while connecting to server.")
            return;
        }
    }

    const handleEditClicked = (id) => {
        setEditAppId(id);
    };


    const handleEdit = async ({ app }) => {

        if (!resume) {
            toast.error("Please upload a resume.");
            return;
        }

        const maxSize = 10 * 1024 * 1024;

        const allowedTypes = [
            "application/pdf",
            //"application/msword", // .doc
            //"application/vnd.openxmlformats-officedocument.wordprocessingml.document" // .docx
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
                toast.error(errmsg);
                return;
            }

            const data = await response.text();
            toast.success(data);
            console.log("data : ", data);

            setResume(null);

            setTimeout(() => {
                navigate(0);
            }, 1000);

        } catch (e) {
            toast.error("Error occured while updating your Job Application");
            return;
        }
    };


    const handleFileChange = (e) => {
        setResume(e.target.files[0]);
    }

    //send base 64 data to front
    const openPdf = (base64String) => {
        const byteCharacters = atob(base64String);
        const byteNumbers = new Array(byteCharacters.length).fill().map((_, i) =>
            byteCharacters.charCodeAt(i)
        );
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'application/pdf' });
        const blobUrl = URL.createObjectURL(blob);
        window.open(blobUrl);
    };

    //approve/reject a application
    const handleStatusChange = async ({ app, newStatus }) => {

        try {
            const response = await fetch("http://localhost:8080/api/applyJobs/updateBYEmp", {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token,
                },
                body: JSON.stringify({
                    id: app.id,
                    status: newStatus
                })
            });
            const data = await response.text();
            if (!response.ok) {
                toast.error(data);
                return;
            }
            toast.success(data);
            setConfirmationAppId(null);
            navigate(0);
        } catch {
            toast.error("An error occurred while updating the job application");
            setConfirmationAppId(null);
        }
    };


    return (
        <div className='ApplicationCard-container'>
            {applications.map((app, index) => (
                <div key={index} className="application-item">
                    <p><strong>Job Title:</strong> {app.jobTitle}</p>
                    <p><strong>Company:</strong> {app.companyName}</p>
                    <p>
                        <strong>Resume:</strong>{' '}
                        {app.resumeBase64 ? (
                            <button onClick={() => openPdf(app.resumeBase64)}>View Resume</button>

                        ) : (
                            'No resume uploaded'
                        )}

                    </p>


                    {(app.status === 'APPROVED')
                        &&
                        <p style={{ color: 'green' }}><strong>Status:</strong> {app.status}</p>
                    }
                    {(app.status == 'REJECTED')
                        &&
                        <p style={{ color: 'red' }}><strong>Status:</strong> {app.status}</p>
                    }
                    {(app.status == 'PENDING')
                        &&
                        <p><strong>Status:</strong> {app.status}</p>
                    }



                    <p><strong>Applied At:</strong> {new Date(app.appliedAt).toLocaleString()}</p>
                    {(role === 'seeker' || role === 'admin') && <button className='delete-button' onClick={() => { handleDelete({ app }) }}>Delete</button>}
                    {role === 'seeker' && <button className='edit-button' onClick={() => handleEditClicked(app.id)}>Edit</button>}

                    {/*approve/reject button*/}
                    {role === 'employer' && (
                        confirmationAppId === app.id ? (
                            <>
                                <p>Are you sure you want to {actionType.toLowerCase()} this application?</p>
                                <button onClick={() => handleStatusChange({ app, newStatus: actionType })}>Yes</button>
                                <button onClick={() => setConfirmationAppId(null)}>No</button>
                            </>
                        ) : (
                            <>
                                <button className='edit-button' onClick={() => {
                                    setConfirmationAppId(app.id);
                                    setActionType("APPROVED");
                                }}>Approve</button>

                                <button className='delete-button' style={{ marginLeft: '8px' }} onClick={() => {
                                    setConfirmationAppId(app.id);
                                    setActionType("REJECTED");
                                }}>Reject</button>
                            </>
                        )
                    )
                    }

                    {role === 'seeker' && editAppId === app.id && (
                        <>
                            <input type='file' onChange={handleFileChange} />
                            <SubmitButton msg="Update" onClick={() => handleEdit({ app })} />
                        </>
                    )}


                </div>
            ))}
        </div>
    );
}
