import { useEffect, useState } from "react";
import ViewProfile from "../../components/ViewProfile/ViewProfile";
import { data, useSearchParams } from "react-router-dom";
import './ViewProfilePage.css';
import { useNavigate } from "react-router-dom";
import NavBar from "../../components/HomeComp/NavBar/NavBar";
import { toast } from "react-toastify";

export default function ViewProfilePage() {

  const navigate = useNavigate();

  //const [error, toast.error] = useState("");
  //const [success, toast.success] = useState("");
  const [profile, setProfile] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("auth-token");
  const role = localStorage.getItem("role");

  const fetchProfile = async () => {


    setLoading(true);

    try {
      console.log("Token:", token);
      let url;
      if (role === "employer") {
        url = "http://localhost:8080/api/employers/profile";
      } else if (role === "seeker") {
        url = "http://localhost:8080/api/seekers/profile";
      } else {
        url = "http://localhost:8080/api/admin/profile";
      }
      console.log("Fetching profile from URL:", url);
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        toast.error("Failed to fetch profile");
        return;
      }

      const data = await response.json();
      console.log("Profile data fetched successfully:", data);
      setProfile(data);
      console.log("data :", data);
      console.log("data.role : ", data.role);

    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <><NavBar role={role} />
      <div className="viewprofilepage-container">
        <div className="viewprofilepage-content">
          <h1 className="viewprofilepage-title">Your Profile</h1>


          <div className="viewprofile-card">
            <ViewProfile profile={profile} />

            {/*button inside the card */}
            <div className="Edit-profile-button">
              <button className="jl-btn jl-btn-primary" onClick={() => navigate('/updateProfile')}>Edit Profile</button>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
