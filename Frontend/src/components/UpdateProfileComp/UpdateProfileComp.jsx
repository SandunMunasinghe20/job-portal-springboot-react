import { useState ,useEffect } from "react";
import { fetchFromBackend } from "../../services/Service";
import './UpdateProfileComp.css'
import SubmitButton from "../submitButton/submitbutton";
import { useNavigate } from "react-router-dom";

export default function UpdateProfileComp({}) {

  const navigate = useNavigate();

    //set Error
    const [err,setErr] = useState("");
    const [success,setSuccess] = useState("");
    const [loading, setLoading] = useState(true);

    // Seeker states
    const [fname, setFname] = useState("");
    const [lname, setLname] = useState("");
    const [phone, setPhone] = useState("");
    const [location, setLocation] = useState("");
    const [skills, setSkills] = useState([]);
    const [currentJobTitle, setCurrentJobTitle] = useState("");
    const [totalExperience, setTotalExperience] = useState(0);
    const [resumeUrl, setResumeUrl] = useState("");
    const [jobTypePreference, setJobTypePreference] = useState("");
    const [preferredIndustry, setPreferredIndustry] = useState("");
    const [expectedSalary, setExpectedSalary] = useState(0);
    const [availability, setAvailability] = useState("");
    const [profilePictureUrl, setProfilePictureUrl] = useState("");
    const [education, setEducation] = useState("");
    const [workExperience, setWorkExperience] = useState("");
    const [certifications, setCertifications] = useState("");

    // Employer states
    const [companyName, setCompanyName] = useState("");
    const [address, setAddress] = useState("");
    const [registrationNumber, setRegistrationNumber] = useState(0);
    const [industry, setIndustry] = useState("");
    const [companySize, setCompanySize] = useState("");
    const [website, setWebsite] = useState("");
    const [logoUrl, setLogoUrl] = useState("");
    const [companyDescription, setCompanyDescription] = useState("");

    const role = localStorage.getItem("role");

    useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setErr("");
      setSuccess("")
      try {
        const url =
          role === "seeker"
            ? "http://localhost:8080/api/seekers/profile"
            : "http://localhost:8080/api/employers/profile";

        const response = await fetchFromBackend({ url, method: "GET" });

        if (!response.ok) {
            setErr("Failed to fetch profile");
            return;
        }

        const data = await response.json();

        // Fill states
        if (role === "seeker") {
          setFname(data.fname || "");
          setLname(data.lname || "");
          setPhone(data.phone || "");
          setLocation(data.location || "");
          setSkills(data.skills || []);
          setCurrentJobTitle(data.currentJobTitle || "");
          setTotalExperience(data.totalExperience || 0);
          setResumeUrl(data.resumeUrl || "");
          setJobTypePreference(data.jobTypePreference || "");
          setPreferredIndustry(data.preferredIndustry || "");
          setExpectedSalary(data.expectedSalary || 0);
          setAvailability(data.availability || "");
          setProfilePictureUrl(data.profilePictureUrl || "");
          setEducation(data.education || "");
          setWorkExperience(data.workExperience || "");
          setCertifications(data.certifications || "");
        } else {
          setCompanyName(data.companyName || "");
          setAddress(data.address || "");
          setPhone(data.phone || "");
          setRegistrationNumber(data.registrationNumber || 0);
          setIndustry(data.industry || "");
          setCompanySize(data.companySize || "");
          setWebsite(data.website || "");
          setLogoUrl(data.logoUrl || "");
          setCompanyDescription(data.companyDescription || "");
        }
        
      } catch (error) {
        setErr("Unable to load profile data.");
      }finally{
        setLoading(false);
      }
      
    };

    fetchProfile();
  }, [role]);

    const handlesubmit = async () => {
        //const token = localStorage.getItem("auth-token");
        
        let url;
        let body= {};

       if (role === "seeker") {
        url = "http://localhost:8080/api/seekers/update";
        body = {
            fname,
            lname,
            phone,
            location,
            skills,
            currentJobTitle,
            totalExperience,
            resumeUrl,
            jobTypePreference,
            preferredIndustry,
            expectedSalary,
            availability,
            profilePictureUrl,
            education,
            workExperience,
            certifications
        };
    } else if (role === "employer") {
        url = "http://localhost:8080/api/employers/update";
        body = {
            companyName,
            address,
            phone,
            registrationNumber,
            industry,
            companySize,
            website,
            logoUrl,
            companyDescription
        };
    }

        
        setErr("");

        try {
            const response = await fetchFromBackend({url,method:'PUT',body})
            console.log("response is: ",response);
            console.log("url is ; ",url);

            if(!response.ok){
                setErr("Error occured while connecting with server.");
            }else{
                setSuccess("Profile updated successfully!");
                navigate('/profile');
            }


        } catch (error) {
            setErr("Failed to load your data to update");
        }
    };
    if (loading) return <p>Loading profile...</p>;

    return (
  <div className="update-profile">
    <h2>Update Profile</h2>

    {err && <p style={{ color: "red" }}>{err}</p>}

    {localStorage.getItem("role") === "seeker" ? (
  <>
    <label>First Name</label>
    <input type="text" value={fname} onChange={(e) => setFname(e.target.value)} placeholder="First Name" />

    <label>Last Name</label>
    <input type="text" value={lname} onChange={(e) => setLname(e.target.value)} placeholder="Last Name" />

    <label>Phone</label>
    <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone" />

    <label>Location</label>
    <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Location" />

    <label>Skills (comma separated)</label>
    <input type="text" value={skills} onChange={(e) => setSkills(e.target.value.split(","))} placeholder="Skills" />

    <label>Current Job Title</label>
    <input type="text" value={currentJobTitle} onChange={(e) => setCurrentJobTitle(e.target.value)} placeholder="Current Job Title" />

    <label>Total Experience (Years)</label>
    <input type="number" value={totalExperience} onChange={(e) => setTotalExperience(e.target.value)} placeholder="Total Experience" />

    <label>Resume URL</label>
    <input type="text" value={resumeUrl} onChange={(e) => setResumeUrl(e.target.value)} placeholder="Resume URL" />

    <label>Job Type Preference</label>
    <input type="text" value={jobTypePreference} onChange={(e) => setJobTypePreference(e.target.value)} placeholder="Job Type Preference" />

    <label>Preferred Industry</label>
    <input type="text" value={preferredIndustry} onChange={(e) => setPreferredIndustry(e.target.value)} placeholder="Preferred Industry" />

    <label>Expected Salary</label>
    <input type="number" value={expectedSalary} onChange={(e) => setExpectedSalary(e.target.value)} placeholder="Expected Salary" />

    <label>Availability</label>
    <input type="text" value={availability} onChange={(e) => setAvailability(e.target.value)} placeholder="Availability" />

    <label>Profile Picture URL</label>
    <input type="text" value={profilePictureUrl} onChange={(e) => setProfilePictureUrl(e.target.value)} placeholder="Profile Picture URL" />

    <label>Education</label>
    <input type="text" value={education} onChange={(e) => setEducation(e.target.value)} placeholder="Education" />

    <label>Work Experience</label>
    <textarea value={workExperience} onChange={(e) => setWorkExperience(e.target.value)} placeholder="Work Experience" />

    <label>Certifications</label>
    <textarea value={certifications} onChange={(e) => setCertifications(e.target.value)} placeholder="Certifications" />
  </>
) : (
  <>
    <label>Company Name</label>
    <input type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="Company Name" />

    <label>Address</label>
    <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Address" />

    <label>Phone</label>
    <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone" />

    <label>Registration Number</label>
    <input type="number" value={registrationNumber} onChange={(e) => setRegistrationNumber(e.target.value)} placeholder="Registration Number" />

    <label>Industry</label>
    <input type="text" value={industry} onChange={(e) => setIndustry(e.target.value)} placeholder="Industry" />

    <label>Company Size</label>
    <input type="text" value={companySize} onChange={(e) => setCompanySize(e.target.value)} placeholder="Company Size" />

    <label>Website</label>
    <input type="text" value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="Website" />

    <label>Logo URL</label>
    <input type="text" value={logoUrl} onChange={(e) => setLogoUrl(e.target.value)} placeholder="Logo URL" />

    <label>Company Description</label>
    <textarea value={companyDescription} onChange={(e) => setCompanyDescription(e.target.value)} placeholder="Company Description" />
  </>
)}


    <SubmitButton msg="Update Profile" onClick={handlesubmit} />
    {success && <p style={{ color: "green" }}>{success}</p>}
    

  </div>
);


}