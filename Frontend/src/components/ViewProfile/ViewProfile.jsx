import React from 'react';
import SubmitButton from '../submitButton/submitbutton';
import { useNavigate } from 'react-router-dom';

export default function ViewProfile({ profile }) {
  const navigate = useNavigate();

  if (!profile) {
    return (
      <div className="text-center text-red-600 font-medium py-10">
        Unable to load profile. Try again later.
      </div>
    );
  }

  const isSeeker = profile.role === 'seeker';

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-lg space-y-8 mt-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start sm:space-x-6 text-center sm:text-left">
        
        <img
              src={
                isSeeker
                  ? profile.profilePicture
                    ? `data:image/jpeg;base64,${profile.profilePicture}`
                    : "/default-user.png"
                  : profile.companyLogo
                    ? profile.companyLogo
                    : "/default-company.png"
              }
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border border-gray-300 shadow-sm"
        />


        <div className="mt-4 sm:mt-0">
          <h2 className="text-2xl font-bold text-gray-800">
            {isSeeker
              ? `${profile.fname || ''} ${profile.lname || ''}`.trim()
              : profile.companyName}
          </h2>
          {!isSeeker && (
            <p className="text-gray-500 text-sm mt-1">{profile.email}</p>
          )}
        </div>
      </div>

      {/* Details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-gray-700 text-sm">
        {isSeeker ? (
          <>
            <Detail label="Current Job Title" value={profile.currentJobTitle} />
            <Detail label="Total Experience" value={String(profile.totalExperience ?? 0)} />
            <Detail label="Expected Salary" value={profile.expectedSalary} />
            <Detail label="Availability" value={profile.availability} />
            <Detail label="Job Type Preference" value={profile.jobTypePreference} />
            <Detail label="Preferred Industry" value={profile.preferredIndustry} />
            <Detail label="Location" value={profile.location} />
            <Detail
              label="Skills"
              value={typeof profile.skills === 'string'
                ? profile.skills.split(',').map(s => s.trim()).join(', ')
                : (Array.isArray(profile.skills) ? profile.skills.join(', ') : '')}
            />
            <Detail label="Education" value={profile.education} />
            <Detail label="Work Experience" value={profile.workExperience} />
            <Detail label="Certifications" value={profile.certifications} />

            <div className="sm:col-span-2">
                  <span className="font-semibold text-gray-900 mr-1">Resume:</span>
                  {profile.resumeBase64 ? (
                    <span className="space-x-4">
                      <a
                        href={`data:application/pdf;base64,${profile.resumeBase64}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline hover:text-blue-800"
                      >
                        View
                      </a>
                      <a
                        href={`data:application/pdf;base64,${profile.resumeBase64}`}
                        download="resume.pdf"
                        className="text-blue-600 underline hover:text-blue-800"
                      >
                        Download
                      </a>
                    </span>
                  ) : (
                    <span className="italic text-gray-400">Not Provided</span>
                  )}
              </div>
          </>
        ) : (
          <>
            <Detail label="Company Description" value={profile.companyDescription} />
            <Detail label="Address" value={profile.address} />
            <Detail label="Registration Number" value={profile.registrationNumber} />
            <Detail label="Industry" value={profile.industry} />
            <Detail label="Company Size" value={profile.companySize} />
            <div className="sm:col-span-2">
              <span className="font-semibold text-gray-900 mr-1">Website:</span>
              <a
                href={profile.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline hover:text-blue-800"
              >
                {profile.website}
              </a>
            </div>
          </>
        )}
      </div>

      {/* Button */}
      <div className="text-center">
        <SubmitButton
          onClick={() => navigate('/updateProfile')}
          msg="Edit Profile"
        />
      </div>
    </div>
  );
}

function Detail({ label, value }) {
  return (
    <p>
      <span className="font-semibold text-gray-900">{label}:</span>{' '}
      {value ? value : <span className="italic text-gray-400">Not Provided</span>}
    </p>
  );
}
