import React from "react";

import { useEffect, useState } from "react";
import ProfileCard from "../../components/ProfileCard/ProfileCard";
import { fetchFromBackend } from "../../services/Service";
import NavBar from "../../components/HomeComp/NavBar/NavBar";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";

export default function UsersPage() {
  const API_URL = import.meta.env.VITE_API_URL;
  
  const [users, setUsers] = useState([]);

  const role = localStorage.getItem("role");

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const roletoget = queryParams.get("role");

  useEffect(() => {
    async function loadUsers() {
      let response;

      if (roletoget === "employer") {
        response = await fetchFromBackend({
          url: `${API_URL}/employers/all`,
          method: "GET",
        });
      } else {
        response = await fetchFromBackend({
          url: `${API_URL}/seekers/all`,
          method: "GET",
        });
      }

      const data = await response.json();

      if (data.error) {
        toast.error(data.error);
      } else {
        setUsers(data);
        console.log("data is: ", data);
      }
    }
    if (roletoget) loadUsers();
  }, [roletoget]);

  return (
    <>
      <NavBar role={role} />
      <div className="pb-4">
        <h2 className="pb-4 text-3xl text-center text-blue-600">
          {roletoget === "employer"
            ? "Available Employers"
            : "Available Job Seekers"}
        </h2>

        <div className="pb-4">
          {users.map((user, index) => {
            return (
              <ProfileCard key={index} profile={user} roletoget={roletoget} />
            );
          })}
        </div>
      </div>
    </>
  );
}
