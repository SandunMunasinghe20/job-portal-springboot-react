import { useState, useEffect } from "react";
import { fetchFromBackend } from "../../services/Service";
import SubmitButton from "../submitButton/submitbutton";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import GetInput from "../GetInput/GetInput";
import GetMultiSelect from "../../components/GetInput/GetMultiSelect";

export default function UpdateProfileComp() {
  const navigate = useNavigate();

  //set Error
  const [error, setError] = useState("");
  //const [success, toast.success] = useState("");
  const [loading, setLoading] = useState(true);

  // Seeker states
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [skills, setSkills] = useState("");
  const [currentJobTitle, setCurrentJobTitle] = useState("");
  const [totalExperience, setTotalExperience] = useState("0");
  const [resume, setResume] = useState("");
  const [jobTypePreference, setJobTypePreference] = useState("");
  const [preferredIndustry, setPreferredIndustry] = useState("");
  const [expectedSalary, setExpectedSalary] = useState(0);
  const [availability, setAvailability] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
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
  const [companyLogo, setCompanyLogo] = useState("");
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

        console.log("data fetched to edit : ", data);

        // Fill states
        if (role === "seeker") {
          setFname(data.fname || "");
          setLname(data.lname || "");
          setPhone(data.phone || "");
          setLocation(data.location || "");
          setSkills(data.skills || "");
          setCurrentJobTitle(data.currentJobTitle || "");
          setTotalExperience(data.totalExperience || 0);
          setResume(data.resume || "");
          setJobTypePreference(data.jobTypePreference || "");
          setPreferredIndustry(data.preferredIndustry || "");
          setExpectedSalary(data.expectedSalary || 0);
          setAvailability(data.availability || "");
          setProfilePicture(data.profilePicture || "");
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
          setCompanyLogo(data.companyLogo || "");
          setCompanyDescription(data.companyDescription || "");
        }
      } catch (error) {
        toast.error("Unable to load profile data.");
        console.error("Error loading profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [role]);

  const handlesubmit = async () => {
    //const token = localStorage.getItem("auth-token");

    if (Number(totalExperience) < 0) {
      setError("Experience must be a positive number");
      toast.error("Experience must be a positive number");
      return;
    } else {
      setError("");
    }

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
        resume,
        jobTypePreference,
        preferredIndustry,
        expectedSalary,
        availability,
        profilePicture,
        education,
        workExperience,
        certifications,
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
        companyLogo,
        companyDescription,
      };
    }

    try {
      const response = await fetchFromBackend({ url, method: "PUT", body });
      console.log("response is: ", response);
      console.log("url is ; ", url);

      if (!response.ok) {
        toast.error("Error occured while connecting with server.");
      } else {
        toast.success("Profile updated successfully!");
        navigate("/profile");
      }
    } catch (error) {
      toast.error("Failed to load your data to update");
      console.error("Error loading profile:", error);
    }
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result.split(",")[1]; // Remove base64 prefix

      if (type === "profilePicture") {
        setProfilePicture(base64String);
      } else if (type === "companyLogo") {
        setCompanyLogo(base64String);
      } else if (type === "resume") {
        setResume(base64String);
      }
    };

    reader.readAsDataURL(file);
  };

  if (loading) return <p>Loading profile...</p>;

  return (
    <div className="min-h-screen px-4 py-10 bg-gray-50 sm:px-6 lg:px-8">
      <div className="max-w-3xl p-6 mx-auto space-y-6 bg-white shadow-md rounded-xl sm:p-10">
        <h2 className="mb-4 text-2xl font-semibold text-center text-blue-600">
          Update Profile
        </h2>

        <form className="space-y-5">
          {role === "seeker" && (
            <>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  First Name
                </label>
                <GetInput
                  placeholder="First Name"
                  value={fname}
                  onChange={setFname}
                  required
                />
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Last Name
                </label>
                <GetInput
                  placeholder="Last Name"
                  value={lname}
                  onChange={setLname}
                />
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Location
                </label>
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
                  "Project Management",
                ]}
              />

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Current Job Title
                </label>
                <GetInput
                  placeholder="Current Job Title"
                  value={currentJobTitle}
                  onChange={setCurrentJobTitle}
                />
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Total Experience (Years)
                </label>
                <GetInput
                  type="number"
                  placeholder="Total Experience"
                  min={0}
                  value={totalExperience}
                  onChange={setTotalExperience}
                />
              </div>

              {error && <p className="text-sm text-red-600">{error}</p>}

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Job Type Preference
                </label>
                <GetInput
                  placeholder="Job Type Preference"
                  value={jobTypePreference}
                  onChange={setJobTypePreference}
                />
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Preferred Industry
                </label>
                <GetInput
                  placeholder="Preferred Industry"
                  value={preferredIndustry}
                  onChange={setPreferredIndustry}
                />
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Expected Salary
                </label>
                <GetInput
                  type="number"
                  placeholder="Expected Salary"
                  value={expectedSalary}
                  onChange={setExpectedSalary}
                />
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Availability
                </label>
                <GetInput
                  placeholder="Availability"
                  value={availability}
                  onChange={setAvailability}
                />
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Upload Profile Picture
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, "profilePicture")}
                  className="block w-full px-4 py-2 mb-4 border border-gray-300 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200"
                />
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Education
                </label>
                <GetInput
                  placeholder="Education"
                  value={education}
                  onChange={setEducation}
                />
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Work Experience
                </label>
                <textarea
                  value={workExperience}
                  onChange={(e) => setWorkExperience(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 text-sm transition-all duration-200 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 focus:bg-white"
                />
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Certifications
                </label>
                <textarea
                  value={certifications}
                  onChange={(e) => setCertifications(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 text-sm transition-all duration-200 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 focus:bg-white"
                />
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Upload Resume
                </label>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => handleFileChange(e, "resume")}
                  className="block w-full px-4 py-2 mb-4 border border-gray-300 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200"
                />
              </div>
            </>
          )}
          {role === "employer" && (
            <>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Upload Company Logo
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, "companyLogo")}
                  className="block w-full px-4 py-2 mb-4 border border-gray-300 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200"
                />
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Company Name
                </label>
                <GetInput
                  placeholder="Company Name"
                  value={companyName}
                  onChange={setCompanyName}
                />
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Address
                </label>
                <GetInput
                  placeholder="Address"
                  value={address}
                  onChange={setAddress}
                />
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Registration Number
                </label>
                <GetInput
                  type="number"
                  placeholder="Registration Number"
                  value={registrationNumber}
                  onChange={setRegistrationNumber}
                />
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Industry
                </label>
                <GetInput
                  placeholder="Industry"
                  value={industry}
                  onChange={setIndustry}
                />
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Company Size
                </label>
                <GetInput
                  placeholder="Company Size"
                  value={companySize}
                  onChange={setCompanySize}
                />
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Website
                </label>
                <GetInput
                  placeholder="Website"
                  value={website}
                  onChange={setWebsite}
                />
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Company Description
                </label>
                <textarea
                  value={companyDescription}
                  onChange={(e) => setCompanyDescription(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 text-sm transition-all duration-200 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 focus:bg-white"
                />
              </div>
            </>
          )}
        </form>

        <div className="flex flex-col justify-end gap-4 pt-4 sm:flex-row">
          <SubmitButton
            onClick={handlesubmit}
            msg="Update Profile"
            className="w-full px-6 py-2 font-medium text-white transition bg-blue-600 rounded-md hover:bg-blue-700 sm:w-auto"
          />
          <SubmitButton
            onClick={() => navigate("/profile")}
            msg="Cancel"
            className="w-full px-6 py-2 font-medium text-gray-800 transition bg-gray-200 rounded-md hover:bg-gray-300 sm:w-auto"
          />
        </div>
      </div>
    </div>
  );
}
