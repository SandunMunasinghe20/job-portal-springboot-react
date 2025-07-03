import React, { useState, useEffect } from "react";
import ApplicationCard from "../../components/ApplicationCard/ApplicationCard";
import NavBar from "../../components/HomeComp/NavBar/NavBar";

import './Applications.css';


export default function Applications() {
    const [applications, setApplications] = useState([]);
    const [err, setErr] = useState("");
    const [loading, setLoading] = useState(true);

    const token = localStorage.getItem("auth-token");
    const role = localStorage.getItem("role");

    useEffect(() => {
        const fetchApplications = async () => {
            setErr("");
            setLoading(true);
            try {

                const response = await fetch("http://localhost:8080/api/applyJobs/view", {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    const errorMsg = await response.text();
                    setErr(errorMsg);
                    setLoading(false);
                    return;
                }

                const data = await response.json();
                console.log("data ", data);
                setApplications(data);
                setLoading(false);
            } catch (error) {
                setErr("Error connecting to server");
                setLoading(false);
            }
        };

        fetchApplications();
    }, []);

    return (
        <> <NavBar role={role} />
            <div className="Applications-container">

                <h1>My Applications</h1>
                {loading && <p>Loading applications...</p>}
                {err && <p style={{ color: "red" }}>{err}</p>}
                <ApplicationCard applications={applications} />
            </div>
        </>
    );
}
