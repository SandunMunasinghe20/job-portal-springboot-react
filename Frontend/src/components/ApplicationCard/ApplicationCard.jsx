import { useNavigate } from "react-router-dom";
import { useState } from "react";
import SubmitButton from "../submitButton/submitbutton";
import { toast } from "react-toastify";
import ConfirmModal from "../ConfirmModel/ConfirmModel";
import { FaRegEnvelope } from "react-icons/fa";

export default function ApplicationCard({ applications }) {
  const API_URL = import.meta.env.VITE_API_URL;

  const role = localStorage.getItem("role");
  const token = localStorage.getItem("auth-token");

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
    try {
      const response = await fetch(`${API_URL}/applyJobs/delete/${app.id}`, {
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      if (!response.ok) {
        toast.error("Error occurred while deleting Job Application");
        return;
      }
      const data = await response.text();
      toast.success(data);
      navigate(0);
    } catch (error) {
      toast.error(`Error occurred while connecting to server.|| ${error}`);
    }
  };

  const handleEditClicked = (id) => {
    setEditAppId(id);
  };

  const handleEdit = async ({ app }) => {
    if (!resume) {
      toast.error("Please upload a resume.");
      return;
    }

    const maxSize = 2 * 1024 * 1024;
    const allowedTypes = ["application/pdf"];

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

      const response = await fetch(`${API_URL}/applyJobs/update/${app.id}`, {
        method: "PUT",
        headers: {
          Authorization: "Bearer " + token,
        },
        body: formData,
      });

      if (!response.ok) {
        const errmsg = await response.text();
        toast.error(errmsg);
        return;
      }

      const data = await response.text();
      toast.success(data);
      setResume(null);
      setTimeout(() => {
        navigate(0);
      }, 1000);
    } catch (e) {
      toast.error("Error occurred while updating your Job Application");
      console.error("Error:", e);
    }
  };

  const handleFileChange = (e) => {
    setResume(e.target.files[0]);
  };

  const openPdf = (base64String) => {
    const byteCharacters = atob(base64String);
    const byteNumbers = new Array(byteCharacters.length)
      .fill()
      .map((_, i) => byteCharacters.charCodeAt(i));
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: "application/pdf" });
    const blobUrl = URL.createObjectURL(blob);
    window.open(blobUrl);
  };

  const handleStatusChange = async ({ app, newStatus }) => {
    try {
      const response = await fetch(`${API_URL}/applyJobs/updateBYEmp`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({
          id: app.id,
          status: newStatus,
        }),
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

  const handleMessage = ({ app }) => {
    navigate(`/msg?receiverId=${app.seekerId}&senderId=${app.id}`);
  };

  const viewApplicant = async (app) => {
    navigate(`/profile?seekerId=${app.seekerId}`);
  };

  return (
    <div className="p-8 space-y-6 bg-white shadow-lg rounded-3xl">
      {applications.length === 0 ? (
        <p className="text-lg text-center text-gray-500">
          No job applications available.
        </p>
      ) : (
        applications.map((app, index) => (
          <div
            key={index}
            className="p-6 transition border border-gray-200 shadow bg-gray-50 rounded-2xl hover:shadow-md"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="mb-1 text-xl font-semibold text-gray-800">
                  {app.jobTitle}
                </h3>
                <p className="text-sm text-gray-500">{app.companyName}</p>
              </div>

              {role === "employer" && (
                <button
                  onClick={() => handleMessage({ app })}
                  className="p-2 transition rounded-full hover:bg-blue-100"
                  title="Send Message"
                >
                  <FaRegEnvelope size={20} className="text-blue-600" />
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 gap-3 mb-4 text-sm text-gray-700 sm:grid-cols-2">
              <div>
                <span className="font-medium text-gray-900">Resume:</span>{" "}
                {app.resumeBase64 ? (
                  <button
                    onClick={() => openPdf(app.resumeBase64)}
                    className="font-medium text-blue-600 hover:underline"
                  >
                    View Resume
                  </button>
                ) : (
                  <span className="italic text-gray-400">Not uploaded</span>
                )}
              </div>

              <div>
                <span className="font-medium text-gray-900">Status:</span>{" "}
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                    app.status === "APPROVED"
                      ? "bg-green-100 text-green-700"
                      : app.status === "REJECTED"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {app.status}
                </span>
              </div>

              <div>
                <span className="font-medium text-gray-900">Applicant:</span>{" "}
                <button
                  onClick={() => viewApplicant(app)}
                  className="font-medium text-blue-600 hover:underline"
                >
                  View Profile
                </button>
              </div>

              <div>
                <span className="font-medium text-gray-900">Applied At:</span>{" "}
                {new Date(app.appliedAt).toLocaleString()}
              </div>
            </div>

            <div className="flex flex-wrap gap-3 mt-4">
              {role === "seeker" && (
                <>
                  <SubmitButton
                    msg="Delete"
                    onClick={() => {
                      setAppToDelete(app);
                      setShowDeleteConfirmModal(true);
                    }}
                  />
                  <SubmitButton
                    msg="Edit"
                    onClick={() => handleEditClicked(app.id)}
                  />
                </>
              )}

              {role === "employer" && (
                <>
                  <SubmitButton
                    msg="Delete"
                    onClick={() => {
                      setAppToDelete(app);
                      setShowDeleteConfirmModal(true);
                    }}
                  />
                  <button
                    className="px-4 py-2 text-sm text-white bg-green-500 rounded-lg hover:bg-green-600"
                    onClick={() => {
                      setPendingApp(app);
                      setPendingActionType("APPROVED");
                      setShowConfirmModal(true);
                    }}
                  >
                    Approve
                  </button>
                  <button
                    className="px-4 py-2 text-sm text-white bg-red-500 rounded-lg hover:bg-red-600"
                    onClick={() => {
                      setPendingApp(app);
                      setPendingActionType("REJECTED");
                      setShowConfirmModal(true);
                    }}
                  >
                    Reject
                  </button>
                </>
              )}
            </div>

            {role === "seeker" && editAppId === app.id && (
              <div className="pt-4 mt-6 border-t">
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200"
                />
                <div className="flex justify-end gap-4 mt-4">
                  <SubmitButton
                    msg="Update"
                    onClick={() => {
                      setAppToEdit(app);
                      setShowEditConfirmModal(true);
                    }}
                  />
                  <button
                    onClick={() => {
                      setEditAppId(null);
                      setResume(null);
                    }}
                    className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        ))
      )}

      {/* Confirmation Modals */}
      {showConfirmModal && (
        <ConfirmModal
          message={`Are you sure you want to ${pendingActionType.toLowerCase()} this application?`}
          onConfirm={() => {
            handleStatusChange({
              app: pendingApp,
              newStatus: pendingActionType,
            });
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
