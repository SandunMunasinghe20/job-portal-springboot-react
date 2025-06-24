import React from 'react';
import './ViewProfile.css';

export default function ViewProfile({ profile }) {

  if (!profile) return <div className="profile-error">Unable to see profile. Try again later..</div>;

  const isSeeker = profile.role === 'seeker';
  console.log("role in view prof elem: ", profile.role);
  console.log("is seeker: ", isSeeker);
  
  return (
    <div className="profile-container">
      <div className="profile-header">
        <img
          src={isSeeker ? profile.profilePic : profile.logoUrl}
          alt="Profile"
          className="profile-image"
        />
        <div>
          <h2 className="profile-name">{isSeeker ? profile.name : profile.companyName}</h2>
          <p className="profile-email">{profile.email}</p>
        </div>
      </div>

      <div className="profile-details">
        {isSeeker ? (
          <>
            <p><strong>Skills:</strong> {profile.skills.join(', ')}</p>
            <p><strong>Experience:</strong> {profile.experience}</p>
            <a
              href={profile.resumeLink}
              target="_blank"
              rel="noopener noreferrer"
              className="profile-link"
            >
              View Resume
            </a>
          </>
        ) : (
          <>
            <p><strong>Company Description:</strong> {profile.companyDescription}</p>
            <p><strong>Address:</strong> {profile.address}</p>
            <p><strong>Phone:</strong> {profile.phone}</p>
            <p><strong>Registration Number:</strong> {profile.registrationNumber}</p>
            <p><strong>Industry:</strong> {profile.industry}</p>
            <p><strong>Company Size:</strong> {profile.companySize}</p>
            <p>
              <strong>Website:</strong>{" "}
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