import { useState, useEffect } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import PdfViewer from "../PdfViewer";
import { ToggleRight, ToggleLeft } from "lucide-react";
import { toast } from "react-toastify";
import { C } from "vitest/dist/chunks/reporters.d.BFLkQcL6.js";

export default function ProfileCard({ profile, roletoget }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isActive, setIsActive] = useState(profile.accountStatus === "active");

  const token = localStorage.getItem("auth-token");

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  useEffect(() => {
    setIsActive(profile.accountStatus === "active");
  }, [profile.accountStatus]);

  const toggleAccountStatus = async () => {
    let url;
    if (isActive) {
      url = "http://localhost:8080/api/admin/deactivate";
    } else {
      url = "http://localhost:8080/api/admin/activate";
    }
    try {
      const response = await fetch(url, {
        method: "PATCH",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: profile.email,
        }),
      });

      const data = await response.text();
      console.log(data);
      if (!response.ok) {
        toast.error(data);
        return;
      }

      toast.success(data);
      setIsActive((prev) => !prev);
    } catch (e) {
      toast.error("Unable to connect with the server.");
      console.error(e);
      return;
    }
  };

  function Detail({ label, value }) {
    return (
      <div className="flex flex-col space-y-1">
        <span className="text-sm font-semibold tracking-wide text-gray-600 uppercase">
          {label}
        </span>
        <span className="text-gray-800">
          {value ? (
            value
          ) : (
            <span className="italic text-gray-400">Not Provided</span>
          )}
        </span>
      </div>
    );
  }

  const currentProfile = profile;

  console.log("roletoget:", roletoget);

  if (roletoget === "admin") {
    console.log("in an admin profile");
    return (
      <div className="max-w-4xl p-8 mx-auto mb-6 bg-white shadow-lg rounded-2xl">
        <div className="text-center">
          <div className="flex items-center justify-center w-24 h-24 mx-auto mb-4 rounded-full bg-blue-50">
            <svg
              className="w-12 h-12 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
          </div>
          <h2 className="mb-2 text-3xl font-bold text-blue-600">
            Admin Profile
          </h2>
          <p className="text-gray-600">System Administrator</p>
        </div>
      </div>
    );
  } else {
    const isSeeker = roletoget === "seeker";

    return (
      <div className="max-w-4xl p-6 mx-auto mb-6 bg-white shadow-lg rounded-2xl">
        {/* Header Section */}
        <div className="flex flex-col items-center mb-6 space-y-4 md:flex-row md:items-start md:space-y-0 md:space-x-6">
          {/* Profile Image */}
          <div className="flex-shrink-0">
            <div className="flex items-center justify-center w-24 h-24 overflow-hidden border-2 border-blue-100 rounded-2xl bg-blue-50">
              {roletoget === "seeker" ? (
                currentProfile.profilePicture ? (
                  <img
                    src={`data:image/jpeg;base64,${currentProfile.profilePicture}`}
                    alt="Profile Picture"
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <svg
                    className="w-12 h-12 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                )
              ) : currentProfile.companyLogo ? (
                <img
                  src={currentProfile.companyLogo}
                  alt="Company Logo"
                  className="object-cover w-full h-full"
                />
              ) : (
                <svg
                  className="w-12 h-12 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              )}
            </div>
          </div>

          {/* Basic Info */}
          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-col items-center mb-4 md:flex-row md:items-start md:justify-between">
              <div>
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-3">
                    <h2 className="mb-2 text-3xl font-semibold text-gray-900">
                      {roletoget === "seeker"
                        ? `${currentProfile.fname || ""} ${
                            currentProfile.lname || ""
                          }`
                        : currentProfile.companyName}
                    </h2>

                    {/* Toggle button */}
                    <button
                      onClick={toggleAccountStatus}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                        isActive
                          ? "bg-green-100 text-green-700 hover:bg-green-200"
                          : "bg-red-100 text-red-700 hover:bg-red-200"
                      }`}
                      title={
                        isActive ? "Deactivate Account" : "Activate Account"
                      }
                    >
                      {isActive ? (
                        <ToggleRight className="w-6 h-6" />
                      ) : (
                        <ToggleLeft className="w-6 h-6" />
                      )}
                    </button>
                  </div>
                </div>

                <p className="mb-2 text-lg font-medium text-blue-600">
                  {roletoget === "seeker"
                    ? currentProfile.currentJobTitle
                    : currentProfile.industry}
                </p>
              </div>

              {/* Role Badge */}
              <div className="flex items-center space-x-2">
                <span className="px-3 py-1 text-sm font-semibold text-blue-800 rounded-full bg-blue-50">
                  {isSeeker ? "Job Seeker" : "Employer"}
                </span>
              </div>
            </div>

            {/* Quick Stats */}
            {roletoget === "seeker" && (
              <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-700 md:justify-start">
                <div className="flex items-center space-x-1">
                  <svg
                    className="w-4 h-4 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                    <circle cx="12" cy="9" r="2.5" />
                  </svg>
                  <span>{currentProfile.location}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <svg
                    className="w-4 h-4 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>{currentProfile.totalExperience} years experience</span>
                </div>
                <div className="flex items-center space-x-1">
                  <svg
                    className="w-4 h-4 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                    />
                  </svg>
                  <span>Rs. {currentProfile.expectedSalary}</span>
                </div>
              </div>
            )}

            {roletoget === "employer" && (
              <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-700 md:justify-start">
                <div className="flex items-center space-x-1">
                  <svg
                    className="w-4 h-4 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  <span>{currentProfile.companySize} employees</span>
                </div>
                <div className="flex items-center space-x-1">
                  <svg
                    className="w-4 h-4 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9"
                    />
                  </svg>
                  <span>{currentProfile.website}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <svg
                    className="w-4 h-4 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  <span>{currentProfile.phone}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Expand/Collapse Button */}
        <div className="flex justify-center mb-4">
          <button
            onClick={toggleExpand}
            className="flex items-center px-6 py-2 space-x-2 font-medium text-blue-600 transition-colors duration-200 bg-blue-50 rounded-xl hover:bg-blue-100"
          >
            <span>{isExpanded ? "Hide Details" : "View Details"}</span>
            {isExpanded ? (
              <ChevronDown className="w-5 h-5" />
            ) : (
              <ChevronRight className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Expandable Details Section */}
        {isExpanded && (
          <div className="pt-6 border-t border-gray-200">
            {roletoget === "seeker" ? (
              <div className="space-y-8">
                {/* Professional Details */}
                <div>
                  <h3 className="flex items-center mb-4 text-2xl font-semibold text-gray-900">
                    <svg
                      className="w-6 h-6 mr-3 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6"
                      />
                    </svg>
                    Professional Information
                  </h3>
                  <div className="grid grid-cols-1 gap-6 p-4 md:grid-cols-2 bg-gray-50 rounded-xl">
                    <Detail
                      label="Availability"
                      value={currentProfile.availability}
                    />
                    <Detail
                      label="Job Role Preference"
                      value={currentProfile.jobrolePreference}
                    />
                    <Detail
                      label="Preferred Industry"
                      value={currentProfile.preferredIndustry}
                    />
                    <Detail
                      label="Education"
                      value={currentProfile.education}
                    />
                  </div>
                </div>

                {/* Experience & Certifications */}
                <div>
                  <h3 className="flex items-center mb-4 text-2xl font-semibold text-gray-900">
                    <svg
                      className="w-6 h-6 mr-3 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                      />
                    </svg>
                    Experience & Qualifications
                  </h3>
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <span className="block mb-2 text-sm font-semibold tracking-wide text-gray-600 uppercase">
                        Work Experience
                      </span>
                      <p className="text-gray-800 whitespace-pre-line">
                        {currentProfile.workExperience || "Not Provided"}
                      </p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <span className="block mb-2 text-sm font-semibold tracking-wide text-gray-600 uppercase">
                        Certifications
                      </span>
                      <p className="text-gray-800 whitespace-pre-line">
                        {currentProfile.certifications || "Not Provided"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Skills */}
                <div>
                  <h3 className="flex items-center mb-4 text-2xl font-semibold text-gray-900">
                    <svg
                      className="w-6 h-6 mr-3 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                      />
                    </svg>
                    Skills & Expertise
                  </h3>
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <div className="flex flex-wrap gap-2">
                      {typeof currentProfile.skills === "string" ? (
                        currentProfile.skills.split(",").map((skill, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 text-sm font-medium text-gray-800 bg-gray-200 rounded-full"
                          >
                            {skill.trim()}
                          </span>
                        ))
                      ) : Array.isArray(currentProfile.skills) ? (
                        currentProfile.skills.map((skill, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 text-sm font-medium text-gray-800 bg-gray-200 rounded-full"
                          >
                            {skill}
                          </span>
                        ))
                      ) : (
                        <span className="italic text-gray-400">
                          Not Provided
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Resume */}
                {currentProfile.resume && (
                  <div>
                    <h3 className="flex items-center mb-4 text-2xl font-semibold text-gray-900">
                      <svg
                        className="w-6 h-6 mr-3 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      Resume
                    </h3>
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <PdfViewer base64Pdf={currentProfile.resume} />
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Employer Details */
              <div className="space-y-8">
                <div>
                  <h3 className="flex items-center mb-4 text-2xl font-semibold text-gray-900">
                    <svg
                      className="w-6 h-6 mr-3 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                    Company Information
                  </h3>
                  <div className="grid grid-cols-1 gap-6 p-4 md:grid-cols-2 bg-gray-50 rounded-xl">
                    <Detail
                      label="Company Size"
                      value={currentProfile.companySize}
                    />
                    <Detail
                      label="Registration Number"
                      value={currentProfile.registrationNumber}
                    />
                    <Detail label="Phone" value={currentProfile.phone} />
                    <div className="flex flex-col space-y-1">
                      <span className="text-sm font-semibold tracking-wide text-gray-600 uppercase">
                        Website
                      </span>
                      <span className="text-gray-800">
                        {currentProfile.website ? (
                          <a
                            href={currentProfile.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 underline transition-colors hover:text-blue-800"
                          >
                            {currentProfile.website}
                          </a>
                        ) : (
                          <span className="italic text-gray-400">
                            Not Provided
                          </span>
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="flex items-center mb-4 text-2xl font-semibold text-gray-900">
                    <svg
                      className="w-6 h-6 mr-3 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4 6h16M4 12h16M4 18h7"
                      />
                    </svg>
                    About Company
                  </h3>
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-gray-800 whitespace-pre-line">
                      {currentProfile.companyDescription || "Not Provided"}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
}
