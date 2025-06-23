import { useEffect, useState } from "react";
import ViewProfile from "../../components/ViewProfile/ViewProfile";
import { data, useSearchParams } from "react-router-dom";

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
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">Your Profile</h1>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      <ViewProfile profile ={profile}/>
      {success && <div className="text-green-600 mt-2">{success}</div>}
    </div>
  );
}