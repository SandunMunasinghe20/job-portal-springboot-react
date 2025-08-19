import { useNavigate } from "react-router-dom";
import {
  Edit3,
  Download,
  Eye,
  MapPin,
  Briefcase,
  Star,
  Globe,
  Building2,
  Users,
  Award,
  Clock,
  User,
  Mail,
  Phone,
  GraduationCap,
} from "lucide-react";

const SubmitButton = ({ onClick, msg }) => (
  <button
    onClick={onClick}
    className="flex items-center gap-2 px-6 py-2 font-medium text-white transition-all duration-200 bg-blue-600 shadow-sm hover:bg-blue-700 rounded-xl hover:shadow-md"
  >
    <Edit3 size={16} />
    {msg}
  </button>
);

export default function ViewProfile({ profile }) {
  const navigate = useNavigate();

  if (!profile) {
    return (
      <div className="max-w-2xl p-8 mx-auto mt-6 bg-white shadow-md rounded-2xl">
        <div className="text-center">
          <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-red-50">
            <span className="text-xl text-red-600">⚠</span>
          </div>
          <h3 className="mb-2 text-lg font-semibold text-red-600">
            Profile Not Available
          </h3>
          <p className="text-gray-500">
            Unable to load profile. Try again later.
          </p>
        </div>
      </div>
    );
  }

  const role = localStorage.getItem("role");

  const isSeeker = role === "seeker";
  const isEmployer = role === "employer";
  const isAdmin = role === "admin";

  console.log("Profile role:", role);
  console.log("isAdmin:", isAdmin);

  const openPdf = (base64String) => {
    try {
      const byteCharacters = atob(base64String);
      const byteNumbers = new Array(byteCharacters.length)
        .fill()
        .map((_, i) => byteCharacters.charCodeAt(i));
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: "application/pdf" });
      const blobUrl = URL.createObjectURL(blob);
      window.open(blobUrl);
    } catch (e) {
      alert("Failed to open PDF: Invalid or corrupted data.");
      console.error(e);
    }
  };

  return (
    <div className="max-w-2xl p-6 mx-auto mb-6 bg-white shadow-md rounded-2xl">
      {/* Header Section */}

      <div className="mb-6 text-center">
        <h1 className="mb-2 text-3xl font-bold text-blue-600">
          {isEmployer ? "Company Profile" : "Profile Overview"}
        </h1>
        <p className="text-gray-500">
          {isEmployer
            ? "Company information and details"
            : "Your professional profile summary"}
        </p>
      </div>

      {/* Profile Picture/Logo and Basic Info */}
      <div className="p-6 mb-6 bg-blue-50 rounded-xl">
        <div className="flex flex-col items-center text-center sm:flex-row sm:items-start sm:space-x-6 sm:text-left">
          <div className="relative">
            <img
              src={
                isSeeker
                  ? profile.profilePicture
                    ? `data:image/jpeg;base64,${profile.profilePicture}`
                    : "/default-user.png"
                  : profile.companyLogo
                    ? `data:image/jpeg;base64,${profile.companyLogo}`
                    : "/default-company.png"
              }
              alt="Profile"
              className="object-cover w-24 h-24 border-4 border-white rounded-full shadow-sm"
            />
            <div className="absolute flex items-center justify-center w-8 h-8 bg-green-500 border-2 border-white rounded-full -bottom-2 -right-2">
              <div className="w-3 h-3 bg-white rounded-full"></div>
            </div>
          </div>

          <div className="flex-1 mt-4 sm:mt-0">
            <h2 className="mb-2 text-2xl font-bold text-gray-800">
              {isSeeker
                ? `${profile.fname || ""} ${profile.lname || ""}`.trim()
                : profile.companyName}
            </h2>
            {isSeeker && profile.currentJobTitle && (
              <p className="mb-1 font-medium text-blue-600">
                {profile.currentJobTitle}
              </p>
            )}
            {!isSeeker && profile.email && (
              <p className="flex items-center justify-center gap-1 mb-1 text-gray-600 sm:justify-start">
                <Mail size={16} />
                {profile.email}
              </p>
            )}
            {profile.location && (
              <p className="flex items-center justify-center gap-1 text-gray-600 sm:justify-start">
                <MapPin size={16} />
                {profile.location}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-2 gap-4 mb-6 sm:grid-cols-3">
        {isSeeker && (
          <>
            <div className="p-4 text-center shadow-sm bg-blue-50 rounded-xl">
              <div className="flex items-center justify-center mb-2">
                <Clock className="text-blue-600" size={20} />
              </div>
              <span className="block text-xl font-semibold text-blue-600">
                {profile.totalExperience || 0}
              </span>
              <span className="text-sm text-gray-600">Years Experience</span>
            </div>
            <div className="p-4 text-center shadow-sm bg-green-50 rounded-xl">
              <div className="flex items-center justify-center mb-2">
                <Award className="text-green-600" size={20} />
              </div>
              <span className="block text-xl font-semibold text-green-600">
                {profile.skills ? profile.skills.split(",").length : 0}
              </span>
              <span className="text-sm text-gray-600">Skills</span>
            </div>
            <div className="p-4 text-center shadow-sm bg-gray-50 rounded-xl">
              <div className="flex items-center justify-center mb-2">
                <Briefcase className="text-gray-600" size={20} />
              </div>
              <span className="block text-xl font-semibold text-gray-600">
                {profile.availability || "N/A"}
              </span>
              <span className="text-sm text-gray-600">Availability</span>
            </div>
          </>
        )}
        {isEmployer && (
          <>
            <div className="p-4 text-center shadow-sm bg-blue-50 rounded-xl">
              <div className="flex items-center justify-center mb-2">
                <Building2 className="text-blue-600" size={20} />
              </div>
              <span className="block text-xl font-semibold text-blue-600">
                {profile.industry || "N/A"}
              </span>
              <span className="text-sm text-gray-600">Industry</span>
            </div>
            <div className="p-4 text-center shadow-sm bg-green-50 rounded-xl">
              <div className="flex items-center justify-center mb-2">
                <Users className="text-green-600" size={20} />
              </div>
              <span className="block text-xl font-semibold text-green-600">
                {profile.companySize || "N/A"}
              </span>
              <span className="text-sm text-gray-600">Company Size</span>
            </div>
          </>
        )}
      </div>

      {/* Detailed Information */}
      <div className="p-6 mb-6 bg-gray-50 rounded-xl">
        {!isAdmin && (
          <h3 className="flex items-center gap-2 mb-4 text-lg font-semibold text-gray-800">
            <User size={18} />
            {isSeeker ? "Professional Details" : "Company Details"}
          </h3>
        )}

        <div className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
          {isSeeker && (
            <>
              <Detail
                icon={<Briefcase size={16} />}
                label="Expected Salary"
                value={profile.expectedSalary}
              />
              <Detail
                icon={<Clock size={16} />}
                label="Job Type Preference"
                value={profile.jobTypePreference}
              />
              <Detail
                icon={<Building2 size={16} />}
                label="Preferred Industry"
                value={profile.preferredIndustry}
              />
              <Detail
                icon={<GraduationCap size={16} />}
                label="Education"
                value={profile.education}
              />

              <div className="sm:col-span-2">
                <Detail
                  icon={<Star size={16} />}
                  label="Skills"
                  value={
                    typeof profile.skills === "string"
                      ? profile.skills
                          .split(",")
                          .map((s) => s.trim())
                          .join(", ")
                      : Array.isArray(profile.skills)
                        ? profile.skills.join(", ")
                        : ""
                  }
                />
              </div>

              <div className="sm:col-span-2">
                <Detail
                  icon={<Award size={16} />}
                  label="Work Experience"
                  value={profile.workExperience}
                />
              </div>

              <div className="sm:col-span-2">
                <Detail
                  icon={<Award size={16} />}
                  label="Certifications"
                  value={profile.certifications}
                />
              </div>

              <div className="sm:col-span-2">
                <div className="flex items-center gap-2 mb-2">
                  <Eye size={16} className="text-gray-600" />
                  <span className="font-medium text-gray-800">Resume:</span>
                </div>
                {profile.resume ? (
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => openPdf(profile.resume)}
                      className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white transition-colors duration-200 bg-blue-600 rounded-lg hover:bg-blue-700"
                    >
                      <Eye size={16} />
                      View Resume
                    </button>
                    <a
                      href={`data:application/pdf;base64,${profile.resume}`}
                      download="resume.pdf"
                      className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white transition-colors duration-200 bg-green-600 rounded-lg hover:bg-green-700"
                    >
                      <Download size={16} />
                      Download Resume
                    </a>
                  </div>
                ) : (
                  <span className="italic text-gray-500">Not Provided</span>
                )}
              </div>
            </>
          )}
          {isEmployer && (
            <>
              <Detail
                icon={<Building2 size={16} />}
                label="Company Description"
                value={profile.companyDescription}
              />
              <Detail
                icon={<MapPin size={16} />}
                label="Address"
                value={profile.address}
              />
              <Detail
                icon={<Award size={16} />}
                label="Registration Number"
                value={profile.registrationNumber}
              />

              <div className="sm:col-span-2">
                <div className="flex items-center gap-2 mb-2">
                  <Globe size={16} className="text-gray-600" />
                  <span className="font-medium text-gray-800">Website:</span>
                </div>
                {profile.website ? (
                  <a
                    href={profile.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-blue-600 underline transition-colors duration-200 hover:text-blue-700"
                  >
                    {profile.website}
                  </a>
                ) : (
                  <span className="italic text-gray-500">Not Provided</span>
                )}
              </div>
            </>
          )}
          {isAdmin && (
            <>
              {/* Show admin-specific info only */}
              <p>Email: {profile.email || "N/A"}</p>
              <p>Role: {role ? role.toLocaleUpperCase() : "N/A"}</p>

              <p>Account Status: {profile.status || "Active"}</p>
            </>
          )}
        </div>
      </div>

      {/* Action Button not for admin*/}
      {!isAdmin && (
        <div className="text-center">
          <SubmitButton
            onClick={() => navigate("/updateProfile")}
            msg="Edit Profile"
          />
        </div>
      )}
    </div>
  );
}

function Detail({ icon, label, value }) {
  return (
    <div className="flex items-start gap-2">
      <div className="text-gray-600 mt-0.5">{icon}</div>
      <div>
        <span className="block font-medium text-gray-800">{label}:</span>
        {value ? (
          <span className="text-gray-700">{value}</span>
        ) : (
          <span className="italic text-gray-500">Not Provided</span>
        )}
      </div>
    </div>
  );
}
