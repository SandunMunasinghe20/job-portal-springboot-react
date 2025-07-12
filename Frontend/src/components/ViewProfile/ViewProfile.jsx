import React from 'react';
//import './ViewProfile.css';

export default function ViewProfile({ profile }) {
  if (!profile) return <div className="profile-error">Unable to see profile. Try again later..</div>;

  const isSeeker = profile.role === 'seeker';

  return (
    <div className="profile-container">
      <div className="profile-header">
        <img
          src={isSeeker ? profile.profilePictureUrl : profile.logoUrl}
          alt="Profile"
          className="profile-image"
        />
        <div>
          <h2 className="profile-name">{isSeeker ? `${profile.fname || ''} ${profile.lname || ''}`.trim() : profile.companyName}</h2>
          {!isSeeker && <p className="profile-email">{profile.email}</p>}
        </div>
      </div>

      <div className="profile-details">
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
            <p>
              <strong>Resume:</strong>{' '}
              {profile.resumeBase64 ? (
                <a
                  href={`data:application/pdf;base64,${profile.resumeBase64}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Resume
                </a>
              ) : (
                'N/A'
              )}
            </p>

          </>
        ) : (
          <>
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
    </div>
  );
}
