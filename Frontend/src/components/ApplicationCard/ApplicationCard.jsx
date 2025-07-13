
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
//import './ApplicationCard.css';
import SubmitButton from '../submitButton/submitbutton';
import { fetchFromBackend } from '../../services/Service';
import { toast } from "react-toastify";
import ConfirmModal from '../ConfirmModel/ConfirmModel';


export default function ApplicationCard({ applications }) {

    const role = localStorage.getItem("role");
    const token = localStorage.getItem("auth-token");
    console.log("token is ", token);
    console.log("role : ", role);


    //const [err, toast.error] = useState("");
    //const [success, toast.success] = useState("");

    const [resume, setResume] = useState(null);
    const [editAppId, setEditAppId] = useState(null);

    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [pendingApp, setPendingApp] = useState(null);
    const [pendingActionType, setPendingActionType] = useState("");

    const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
    const [appToDelete, setAppToDelete] = useState(null);

    const [showEditConfirmModal, setShowEditConfirmModal] = useState(false);
    const [appToEdit, setAppToEdit] = useState(null);


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
            setPendingApp(null);
            navigate(0);
        } catch {
            toast.error("An error occurred while updating the job application");
            setPendingApp(null);
        }
    };


    return (
        <div className='bg-white rounded-2xl shadow-md p-6 mb-6 max-w-2xl mx-auto'>

            <div className='space-y-6'>
                {applications.map((app, index) => (

                    <div key={index} className="bg-white shadow-md rounded-xl p-6 space-y-4 border border-gray-300">

                        <p className='text-gray-700'>
                            <strong className='text-gray-900'>Job Title:</strong>
                            {app.jobTitle}
                        </p>
                        <p className='text-gray-700'><strong className="text-gray-900">Company:</strong> {app.companyName}</p>
                        <p className='text-gray-700'>
                            <strong className="text-gray-900">Resume:</strong>{' '}

                            {app.resumeBase64 ? (
                                <button
                                    onClick={() => openPdf(app.resumeBase64)}
                                    className="text-blue-600 hover:text-blue-800 underline font-medium transition-all cursor-pointer"
                                >
                                    View Resume
                                </button>


                            ) : (
                                'No resume uploaded'
                            )}

                        </p>

                        {/*each status has diff colours*/}

                        <div className='flex gap-1'>
                            <p className="text-gray-700 font-medium">Status:</p>
                            <p className={`font-semibold ${app.status === 'APPROVED' ? 'text-green-600' :
                                app.status === 'REJECTED' ? 'text-red-600' :
                                    'text-yellow-600'
                                }`}>
                                {app.status}
                            </p>
                        </div>



                        <p className='text-gray-700'><strong className="text-gray-900">Applied At:</strong> {new Date(app.appliedAt).toLocaleString()}</p>

                        {/*edit/del button*/}
                        <div className='flex items-center gap-x-4'>
                            {(role === 'seeker')
                                &&
                                <SubmitButton
                                    onClick={() => {
                                        setAppToDelete(app);
                                        setShowDeleteConfirmModal(true);
                                    }}
                                    msg="Delete"
                                />
                            }

                            {role === 'seeker'
                                &&
                                <SubmitButton onClick={() => handleEditClicked(app.id)} msg="Edit" />}
                        </div>


                        {/*approve/reject/del button for emp*/}
                        <div className='flex items-center gap-x-4'>
                            {(role === 'employer')
                                &&
                                <SubmitButton
                                    onClick={() => {
                                        setAppToDelete(app);
                                        setShowDeleteConfirmModal(true);
                                    }}
                                    msg="Delete"
                                />}

                            {role === 'employer' && (
                                <div className="flex gap-2">
                                    <button
                                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
                                        onClick={() => {
                                            setPendingApp(app);
                                            setPendingActionType("APPROVED");
                                            setShowConfirmModal(true);
                                        }}
                                    >
                                        Approve
                                    </button>

                                    <button
                                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
                                        onClick={() => {
                                            setPendingApp(app);
                                            setPendingActionType("REJECTED");
                                            setShowConfirmModal(true);
                                        }}
                                    >
                                        Reject
                                    </button>
                                </div>
                            )}
                        </div>


                        {role === 'seeker' && editAppId === app.id && (
                            <div className='mt-4 space-y-2'>
                                <input
                                    type='file'
                                    onChange={handleFileChange}
                                    className="w-full mb-4 block border border-gray-300 rounded-lg px-4 py-2 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200"
                                />
                                {/*update and cancel buttons*/}
                                <div className="flex justify-center items-center gap-4">
                                    <SubmitButton msg="Update" onClick={() => {
                                        setAppToEdit(app);
                                        setShowEditConfirmModal(true);
                                    }} />

                                    <button
                                        onClick={() => {
                                            setEditAppId(null);
                                            setResume(null);
                                        }}
                                        className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}


                    </div>

                ))}
            </div>
            {/*confirmation of actions */}
            {showConfirmModal && (
                <ConfirmModal
                    message={`Are you sure you want to ${pendingActionType.toLowerCase()} this application?`}
                    onConfirm={() => {
                        handleStatusChange({ app: pendingApp, newStatus: pendingActionType });
                        setShowConfirmModal(false);
                        setPendingApp(null);
                        setPendingActionType("");
                    }}
                    onCancel={() => {
                        setShowConfirmModal(false);
                        setPendingApp(null);
                        setPendingActionType("");
                    }}
                />
            )}

            {showDeleteConfirmModal && (
                <ConfirmModal
                    message="Are you sure you want to delete this application?"
                    onConfirm={() => {
                        handleDelete({ app: appToDelete });
                        setShowDeleteConfirmModal(false);
                        setAppToDelete(null);
                    }}
                    onCancel={() => {
                        setShowDeleteConfirmModal(false);
                        setAppToDelete(null);
                    }}
                />
            )}

            {showEditConfirmModal && (
                <ConfirmModal
                    message="Are you sure you want to update this resume?"
                    onConfirm={() => {
                        handleEdit({ app: appToEdit });
                        setShowEditConfirmModal(false);
                        setAppToEdit(null);
                    }}
                    onCancel={() => {
                        setShowEditConfirmModal(false);
                        setAppToEdit(null);
                    }}
                />
            )}



        </div>
    );
}
