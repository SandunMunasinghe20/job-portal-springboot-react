import React from "react";
import './ProfilCard.css';

export default function ProfileCard({ profile, roletoget }) {
  console.log("roletoget:", roletoget);

  if (roletoget === 'admin') {
    console.log("in a admin profile");
    return (
      <h2>hi admin</h2>
    );

  } else {
    return (
      <div className="profile-card">
        <img
          src={roletoget === 'seeker' ? profile.profilePictureUrl : profile.logoUrl}
          alt="Profile"
          className="profile-image"
        />

        <h2>
          {roletoget === 'seeker'
            ? `${profile.fname || ''} ${profile.lname || ''}`
            : profile.companyName}
        </h2>

        <p>{roletoget === 'seeker' ? profile.currentJobTitle : profile.industry}</p>

        {roletoget === 'seeker' && (
          <>

            <p><strong>Location:</strong> {profile.location}</p>
            <p><strong>Total Experience:</strong> {profile.totalExperience} years</p>
            <p><strong>Expected Salary:</strong> {profile.expectedSalary}</p>
            <p><strong>Availability:</strong> {profile.availability}</p>
            <p><strong>Job role Preference:</strong> {profile.jobrolePreference}</p>
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

        {roletoget === 'employer' && (
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


}
