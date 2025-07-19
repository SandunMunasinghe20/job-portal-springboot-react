import React from "react";
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
    className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-2"
  >
    <Edit3 size={16} />
    {msg}
  </button>
);

export default function ViewProfile({ profile }) {
  const navigate = useNavigate();

  if (!profile) {
    return (
      <div className="bg-white rounded-2xl shadow-md p-8 max-w-2xl mx-auto mt-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-600 text-xl">⚠</span>
          </div>
          <h3 className="text-red-600 font-semibold text-lg mb-2">
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
    <div className="bg-white rounded-2xl shadow-md p-6 mb-6 max-w-2xl mx-auto">
      {/* Header Section */}

      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-blue-600 mb-2">
          {isEmployer ? "Company Profile" : "Profile Overview"}
        </h1>
        <p className="text-gray-500">
          {isEmployer
            ? "Company information and details"
            : "Your professional profile summary"}
        </p>
      </div>

      {/* Profile Picture/Logo and Basic Info */}
      <div className="bg-blue-50 rounded-xl p-6 mb-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start sm:space-x-6 text-center sm:text-left">
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
              className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-sm"
            />
            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
              <div className="w-3 h-3 bg-white rounded-full"></div>
            </div>
          </div>

          <div className="mt-4 sm:mt-0 flex-1">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {isSeeker
                ? `${profile.fname || ""} ${profile.lname || ""}`.trim()
                : profile.companyName}
            </h2>
            {isSeeker && profile.currentJobTitle && (
              <p className="text-blue-600 font-medium mb-1">
                {profile.currentJobTitle}
              </p>
            )}
            {!isSeeker && profile.email && (
              <p className="text-gray-600 mb-1 flex items-center justify-center sm:justify-start gap-1">
                <Mail size={16} />
                {profile.email}
              </p>
            )}
            {profile.location && (
              <p className="text-gray-600 flex items-center justify-center sm:justify-start gap-1">
                <MapPin size={16} />
                {profile.location}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
        {isSeeker && (
          <>
            <div className="p-4 bg-blue-50 rounded-xl shadow-sm text-center">
              <div className="flex items-center justify-center mb-2">
                <Clock className="text-blue-600" size={20} />
              </div>
              <span className="block text-xl font-semibold text-blue-600">
                {profile.totalExperience || 0}
              </span>
              <span className="text-sm text-gray-600">Years Experience</span>
            </div>
            <div className="p-4 bg-green-50 rounded-xl shadow-sm text-center">
              <div className="flex items-center justify-center mb-2">
                <Award className="text-green-600" size={20} />
              </div>
              <span className="block text-xl font-semibold text-green-600">
                {profile.skills ? profile.skills.split(",").length : 0}
              </span>
              <span className="text-sm text-gray-600">Skills</span>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl shadow-sm text-center">
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
            <div className="p-4 bg-blue-50 rounded-xl shadow-sm text-center">
              <div className="flex items-center justify-center mb-2">
                <Building2 className="text-blue-600" size={20} />
              </div>
              <span className="block text-xl font-semibold text-blue-600">
                {profile.industry || "N/A"}
              </span>
              <span className="text-sm text-gray-600">Industry</span>
            </div>
            <div className="p-4 bg-green-50 rounded-xl shadow-sm text-center">
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
      <div className="bg-gray-50 rounded-xl p-6 mb-6">
        {!isAdmin && (
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <User size={18} />
            {isSeeker ? "Professional Details" : "Company Details"}
          </h3>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
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
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center gap-2"
                    >
                      <Eye size={16} />
                      View Resume
                    </button>
                    <a
                      href={`data:application/pdf;base64,${profile.resume}`}
                      download="resume.pdf"
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center gap-2"
                    >
                      <Download size={16} />
                      Download Resume
                    </a>
                  </div>
                ) : (
                  <span className="text-gray-500 italic">Not Provided</span>
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
                    className="text-blue-600 hover:text-blue-700 underline font-medium transition-colors duration-200"
                  >
                    {profile.website}
                  </a>
                ) : (
                  <span className="text-gray-500 italic">Not Provided</span>
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
        <span className="font-medium text-gray-800 block">{label}:</span>
        {value ? (
          <span className="text-gray-700">{value}</span>
        ) : (
          <span className="italic text-gray-500">Not Provided</span>
        )}
      </div>
    </div>
  );
}
