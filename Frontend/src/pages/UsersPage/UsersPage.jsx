import { useEffect, useState } from "react";
import ProfileCard from "../../components/ProfileCard/ProfileCard";
import { fetchFromBackend } from "../../services/Service";
import NavBar from "../../components/HomeComp/NavBar/NavBar";
import './UsersPage.css';

export default function UsersPage() {

  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");


  const role = localStorage.getItem("role");
  console.log("Current users role is: ", role);
  const roletoget = localStorage.getItem("role-to-get");
  console.log("role-to-get: ", roletoget);

  useEffect(() => {
    async function loadUsers() {
      let response;

      if (roletoget === 'employer') {
        response = await fetchFromBackend({
          url: "http://localhost:8080/api/employers/all",
          method: "GET"
        });

      } else {
        response = await fetchFromBackend({
          url: "http://localhost:8080/api/seekers/all",
          method: "GET"
        });
      }

      const data = await response.json();

      if (data.error) {
        setError(data.error);
      } else {
        setUsers(data);
        console.log("data is: ", data);
      }
    }
    loadUsers();
  }, []);


  return (
    <>
      <NavBar role={role} />
      <div className="users-page-container">
        <h2 className="users-page-title">
          {roletoget === "employer" ? "Available Employers" : "Available Job Seekers"}
        </h2>

        <div className="profile-grid">
          {users.map((user, index) => {
            //const rolenew = user.role;
            return (
              <ProfileCard key={index} profile={user} roletoget={roletoget} />
            );
          })}
        </div>
      </div>
    </>
  );


}