import React from 'react';
//import './ViewProfile.css';
import SubmitButton from '../submitButton/submitbutton';
import { useNavigate } from 'react-router-dom';

export default function ViewProfile({ profile }) {

  const navigate = useNavigate();

  if (!profile) return <div className="profile-error">Unable to see profile. Try again later..</div>;

  const isSeeker = profile.role === 'seeker';

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-md rounded-xl p-6 space-y-8 ">

      <div className="flex items-center space-x-6 ">
        <img
          src={isSeeker ? profile.profilePictureUrl : profile.logoUrl}
          alt="Profile"
          className="w-24 h-24 rounded-full object-cover border border-gray-300 shadow-sm"
        />

        <div>
          <h2 className="text-2xl font-semibold text-gray-800">{isSeeker ? `${profile.fname || ''} ${profile.lname || ''}`.trim() : profile.companyName}</h2>
          {!isSeeker && <p className="text-gray-600 text-sm">{profile.email}</p>}
        </div>
      </div>

      <div className="grid gap-4 text-gray-700">
        {isSeeker ? (
          <>
            <p><strong>Current Job Title:</strong> {profile.currentJobTitle || 'N/A'}</p>
            <p><strong>Total Experience:</strong> {profile.totalExperience ?? 'N/A'}</p>
            <p><strong>Expected Salary:</strong> {profile.expectedSalary ?? 'N/A'}</p>
            <p><strong>Availability:</strong> {profile.availability || 'N/A'}</p>
            <p><strong>Job Type Preference:</strong> {profile.jobTypePreference || 'N/A'}</p>
            <p><strong>Preferred Industry:</strong> {profile.preferredIndustry || 'N/A'}</p>
            <p><strong>Location:</strong> {profile.location || 'N/A'}</p>
            <p><strong>Skills:</strong> {profile.skills ? profile.skills.join(', ') : 'N/A'}</p>
            <p><strong>Education:</strong> {profile.education || 'N/A'}</p>
            <p><strong>Work Experience:</strong> {profile.workExperience || 'N/A'}</p>
            <p><strong>Certifications:</strong> {profile.certifications || 'N/A'}</p>

            {/* resume*/}
            {profile.resumeBase64 ? (
              <div className="flex items-center space-x-4">
                <a
                  href={`data:application/pdf;base64,${profile.resumeBase64}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline hover:text-blue-800"
                >
                  View Resume
                </a>
                <a
                  href={`data:application/pdf;base64,${profile.resumeBase64}`}
                  download="resume.pdf"
                  className="text-blue-600 underline hover:text-blue-800"
                >
                  Download PDF
                </a>
              </div>
            ) : (
              <div className='flex items-center space-x-1'>
                <strong>Resume: </strong>
                <p>N/A</p>
              </div>

            )}

          </>
        ) : (

          <>
            {/*employer*/}
            <p><strong>Company Description:</strong> {profile.companyDescription}</p>
            <p><strong>Address:</strong> {profile.address}</p>

            <p><strong>Registration Number:</strong> {profile.registrationNumber}</p>
            <p><strong>Industry:</strong> {profile.industry}</p>
            <p><strong>Company Size:</strong> {profile.companySize}</p>
            <p>
              <strong>Website:</strong>{' '}
              <a href={profile.website} className="profile-link" target="_blank" rel="noopener noreferrer">
                {profile.website}
              </a>
            </p>

          </>
        )}
      </div>

      <SubmitButton onClick={() => navigate('/updateProfile')} msg="Edit Profile" />


    </div>
  );
}
