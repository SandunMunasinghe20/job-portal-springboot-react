import { useEffect, useState } from "react";
import ProfileCard from "../../components/ProfileCard/ProfileCard";

export default function AdminViewSeekers() {

    const token = localStorage.getItem("token");

    const [err, setErr] = useState("");
    const [loading, setLoading] = useState(false);
    const [applications, setApplications] = useState([]);

    const fetchSeekers = async () => {

        try {
            setLoading(true);
            const response = await fetch("http://localhost:8080/api/seekers/all", {
                method: "GET",
                headers: {
                    'Authorization': 'Bearer ' + token,
                },
            });

            if (!response.ok) {
                setErr("Error occured while fetching Seekers");
                return;
            }
            const data = await response.json();
            console.log("seeker data : ", data);
            setLoading(false);
        } catch (error) {
            setErr("Failed to connect with the Server.");
            return;
        }
    }

    /* useEffect(() = {
         // fetchSeekers();
     }, [])
 
 */

}