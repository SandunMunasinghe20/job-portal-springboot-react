import { useState, useEffect } from "react";
import { fetchFromBackend } from "../../services/Service";
//import './UpdateProfileComp.css'
import SubmitButton from "../submitButton/submitbutton";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import GetInput from "../GetInput/GetInput";
import GetMultiSelect from '../../components/GetInput/GetMultiSelect';

export default function UpdateProfileComp({ }) {

  const navigate = useNavigate();

  //set Error
  //const [err, toast.error] = useState("");
  //const [success, toast.success] = useState("");
  const [loading, setLoading] = useState(true);

  // Seeker states
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [skills, setSkills] = useState("");
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

      try {
        const url =
          role === "seeker"
            ? "http://localhost:8080/api/seekers/profile"
            : "http://localhost:8080/api/employers/profile";

        const response = await fetchFromBackend({ url, method: "GET" });

        if (!response.ok) {
          toast.error("Failed to fetch profile");
          return;
        }

        const data = await response.json();

        // Fill states
        if (role === "seeker") {
          setFname(data.fname || "");
          setLname(data.lname || "");
          setPhone(data.phone || "");
          setLocation(data.location || "");
          setSkills(data.skills || "");
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
        toast.error("Unable to load profile data.");
      } finally {
        setLoading(false);
      }

    };

    fetchProfile();
  }, [role]);

  const handlesubmit = async () => {
    //const token = localStorage.getItem("auth-token");

    let url;
    let body = {};

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




    try {
      const response = await fetchFromBackend({ url, method: 'PUT', body })
      console.log("response is: ", response);
      console.log("url is ; ", url);

      if (!response.ok) {
        toast.error("Error occured while connecting with server.");
      } else {
        toast.success("Profile updated successfully!");
        navigate('/profile');
      }


    } catch (error) {
      toast.error("Failed to load your data to update");
    }
  };
  if (loading) return <p>Loading profile...</p>;

  return (
    <div className="bg-gray-50 min-h-screen px-4 sm:px-6 lg:px-8 py-10">
      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-xl p-6 sm:p-10 space-y-6">
        <h2 className="text-2xl font-semibold text-blue-600 text-center mb-4">Update Profile</h2>

        <form className="space-y-5">
          {role === 'seeker' ? (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <GetInput
                  placeholder="First Name"
                  value={fname}
                  onChange={setFname}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <GetInput
                  placeholder="Last Name"
                  value={lname}
                  onChange={setLname}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <GetInput
                  placeholder="Location"
                  value={location}
                  onChange={setLocation}
                />
              </div>


              <GetMultiSelect
                value={skills}
                onChange={setSkills}
                required
                placeholder="Select Your Skills"
                options={[
                  // Frontend
                  "HTML",
                  "CSS",
                  "JavaScript",
                  "TypeScript",
                  "React",
                  "Vue.js",
                  "Angular",
                  "Tailwind CSS",
                  "Bootstrap",
                  "Next.js",
                  "SASS",

                  // Backend
                  "Node.js",
                  "Express.js",
                  "Java",
                  "Spring Boot",

                  "Django",
                  "Flask",
                  "C#",
                  ".NET Core",
                  "PHP",
                  "Laravel",
                  "Ruby on Rails",

                  // Mobile Development
                  "Flutter",
                  "React Native",
                  "Kotlin",
                  "Swift",
                  "Android SDK",
                  "iOS Development",

                  // Databases
                  "MySQL",
                  "PostgreSQL",
                  "MongoDB",
                  "Redis",
                  "SQLite",
                  "Firebase",

                  // DevOps & Tools
                  "Docker",
                  "Kubernetes",
                  "AWS",
                  "Azure",
                  "Google Cloud",
                  "Git",
                  "GitHub",
                  "CI/CD",
                  "Linux",
                  "Bash",
                  "Nginx",
                  "Jenkins",

                  // Testing
                  "JUnit",
                  "Selenium",
                  "Postman",
                  "Cypress",
                  "Jest",
                  "Mocha",

                  // ML
                  "NumPy",
                  "Pandas",
                  "TensorFlow",
                  "Keras",
                  "Scikit-learn",
                  "OpenCV",
                  "Matplotlib",
                  "PyTorch",

                  // Programming Languages
                  "C",
                  "C++",
                  "C#",
                  "Python",
                  "Go",
                  "Rust",
                  "R",
                  "MATLAB",

                  // other
                  "Agile",
                  "Scrum",
                  "Problem Solving",
                  "Communication",
                  "Teamwork",
                  "Time Management",
                  "Project Management"
                ]}
              />


              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Current Job Title</label>
                <GetInput
                  placeholder="Current Job Title"
                  value={currentJobTitle}
                  onChange={setCurrentJobTitle}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Total Experience (Years)</label>
                <GetInput
                  type="number"
                  placeholder="Total Experience"
                  value={totalExperience}
                  onChange={setTotalExperience}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Resume URL</label>
                <GetInput
                  placeholder="Resume URL"
                  value={resumeUrl}
                  onChange={setResumeUrl}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Job Type Preference</label>
                <GetInput
                  placeholder="Job Type Preference"
                  value={jobTypePreference}
                  onChange={setJobTypePreference}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Industry</label>
                <GetInput
                  placeholder="Preferred Industry"
                  value={preferredIndustry}
                  onChange={setPreferredIndustry}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Expected Salary</label>
                <GetInput
                  type="number"
                  placeholder="Expected Salary"
                  value={expectedSalary}
                  onChange={setExpectedSalary}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Availability</label>
                <GetInput
                  placeholder="Availability"
                  value={availability}
                  onChange={setAvailability}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Profile Picture URL</label>
                <GetInput
                  placeholder="Profile Picture URL"
                  value={profilePictureUrl}
                  onChange={setProfilePictureUrl}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Education</label>
                <GetInput
                  placeholder="Education"
                  value={education}
                  onChange={setEducation}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Work Experience</label>
                <textarea
                  value={workExperience}
                  onChange={(e) => setWorkExperience(e.target.value)}
                  rows={4}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Certifications</label>
                <textarea
                  value={certifications}
                  onChange={(e) => setCertifications(e.target.value)}
                  rows={4}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                />
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                <GetInput
                  placeholder="Company Name"
                  value={companyName}
                  onChange={setCompanyName}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <GetInput
                  placeholder="Address"
                  value={address}
                  onChange={setAddress}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Registration Number</label>
                <GetInput
                  type="number"
                  placeholder="Registration Number"
                  value={registrationNumber}
                  onChange={setRegistrationNumber}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
                <GetInput
                  placeholder="Industry"
                  value={industry}
                  onChange={setIndustry}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company Size</label>
                <GetInput
                  placeholder="Company Size"
                  value={companySize}
                  onChange={setCompanySize}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                <GetInput
                  placeholder="Website"
                  value={website}
                  onChange={setWebsite}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Logo URL</label>
                <GetInput
                  placeholder="Logo URL"
                  value={logoUrl}
                  onChange={setLogoUrl}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company Description</label>
                <textarea
                  value={companyDescription}
                  onChange={(e) => setCompanyDescription(e.target.value)}
                  rows={4}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                />
              </div>
            </>
          )}
        </form>

        <div className="flex flex-col sm:flex-row justify-end gap-4 pt-4">
          <SubmitButton
            onClick={handlesubmit}
            msg="Update Profile"
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition w-full sm:w-auto"
          />
          <SubmitButton
            onClick={() => navigate('/profile')}
            msg="Cancel"
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-6 rounded-md transition w-full sm:w-auto"
          />
        </div>
      </div>
    </div>
  );
}
