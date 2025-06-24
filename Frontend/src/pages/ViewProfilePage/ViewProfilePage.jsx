import { useEffect, useState } from "react";
import ViewProfile from "../../components/ViewProfile/ViewProfile";
import { data, useSearchParams } from "react-router-dom";
import './ViewProfilePage.css';
import SubmitButton from '../../components/submitButton/submitbutton';

export default function ViewProfilePage(){
  const [error,setError] = useState("");
  const [success,setSuccess] = useState("");
  const [profile,setProfile] = useState([]);

const fetchProfile = async () => {

      setError("");
      setSuccess("");

      try {
        const token = localStorage.getItem("auth-token"); // assuming token stored on login
        const response = await fetch("http://localhost:8080/api/employers/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          setError("Failed to fetch profile");
          return;
        }

        const data = await response.json();
        setProfile(data);
        console.log("data :",data);
        console.log("data.role : ",data.role);

      } catch (err) {
        setError("Something went wrong");
      } 
    };

    useEffect(()=>{
        fetchProfile();
    },[]);

    return (
  <div className="viewprofilepage-container">
    <div className="viewprofilepage-content">
      <h1 className="viewprofilepage-title">Your Profile</h1>
      
      {/* Profile card including the profile data */}
    <div className="viewprofile-card">
      <ViewProfile profile={profile} />

      {/*button inside the card */}
      <div className="Edit-profile-button">
        <button className="jl-btn jl-btn-primary">Edit Profile</button>
      </div>
    </div>

    {success && <div className="viewprofilepage-success">{success}</div>}
  </div>
</div>
);
}
