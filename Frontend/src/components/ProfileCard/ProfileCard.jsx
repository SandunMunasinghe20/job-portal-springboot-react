import React from "react";
import './ProfilCard.css'; 

export default function ProfileCard({ profile, type }) {
  console.log("type:", type);
  return (
    <div className="profile-card">
      <img
        src={type === 'seeker' ? profile.profilePictureUrl : profile.logoUrl}
        alt="Profile"
        className="profile-image"
      />

      <h2>
        {type === 'seeker'
          ? `${profile.fname || ''} ${profile.lname || ''}`
          : profile.companyName}
      </h2>

      <p>{type === 'seeker' ? profile.currentJobTitle : profile.industry}</p>

      {type === 'seeker' && (
        <>
          <p><strong>Email:</strong> {profile.email}</p>
          <p><strong>Phone:</strong> {profile.phone}</p>
          <p><strong>Location:</strong> {profile.location}</p>
          <p><strong>Total Experience:</strong> {profile.totalExperience} years</p>
          <p><strong>Expected Salary:</strong> {profile.expectedSalary}</p>
          <p><strong>Availability:</strong> {profile.availability}</p>
          <p><strong>Job Type Preference:</strong> {profile.jobTypePreference}</p>
          <p><strong>Preferred Industry:</strong> {profile.preferredIndustry}</p>
          <p><strong>Education:</strong> {profile.education}</p>
          <p><strong>Work Experience:</strong> {profile.workExperience}</p>
          <p><strong>Certifications:</strong> {profile.certifications}</p>
          <p><strong>Resume:</strong> <a href={profile.resumeUrl} target="_blank" rel="noopener noreferrer">View Resume</a></p>

          {profile.skills && profile.skills.length > 0 && (
            <>
              <p><strong>Skills:</strong></p>
              <ul>
                {profile.skills.map((skill, index) => (
                  <li key={index}>{skill}</li>
                ))}
              </ul>
            </>
          )}
        </>
      )}

      {type === 'employer' && (
        <>
          <p><strong>Description:</strong> {profile.companyDescription}</p>
          <p><strong>Website:</strong> <a href={profile.website} target="_blank" rel="noopener noreferrer">{profile.website}</a></p>
          <p><strong>Phone:</strong> {profile.phone}</p>
          <p><strong>Company Size:</strong> {profile.companySize}</p>
          <p><strong>Registration Number:</strong> {profile.registrationNumber}</p>
        </>
      )}
    </div>
  );
}
