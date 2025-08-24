import { useEffect, useState } from "react";
import ViewProfile from "../../components/ViewProfile/ViewProfile";
import { useSearchParams } from "react-router-dom";
import NavBar from "../../components/HomeComp/NavBar/NavBar";
import { toast } from "react-toastify";

import React from "react";


export default function ViewProfilePage() {

  const API_URL = import.meta.env.VITE_API_URL;

  const [profile, setProfile] = useState([]);

  const token = localStorage.getItem("auth-token");
  const role = localStorage.getItem("role");

  const [searchParams] = useSearchParams();
  const paramSeekerId = searchParams.get("seekerId");
  const paramEmployerId = searchParams.get("employerId");

  const fetchProfile = async () => {

    let url;
    //view own profile
    if (!paramSeekerId && !paramEmployerId) {
      if (role === "employer") {
        url = `${API_URL}/employers/profile`;
      } else if (role === "seeker") {
        url = `${API_URL}/seekers/profile`;
      } else {
        url = `${API_URL}/admin/profile`;
      }
    } else {
      //someone view other users profile
      if (paramSeekerId) {
        url = `${API_URL}/seekers/${paramSeekerId}`;
      } else {
        url = `${API_URL}/employers/${paramEmployerId}`;
      }
    }

    try {
      console.log("Token:", token);

      console.log("Fetching profile from URL:", url);
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errmsg = await response.text();
        toast.error(errmsg);
        return;
      }

      const data = await response.json();
      console.log("Profile data fetched successfully:", data);
      setProfile(data);
      console.log("data :", data);
      console.log("data.role : ", data.role);
    } catch (err) {
      toast.error(`Something went wrong || ${err}`);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <>
      <NavBar role={role} />
      <div className="min-h-screen px-4 py-8 bg-gray-50">
        <ViewProfile profile={profile} />
      </div>
    </>
  );
}
