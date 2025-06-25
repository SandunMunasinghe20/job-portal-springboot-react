




export default function ProfileCard({profile,type}){
    
    return (
    <div className="profile-card">
      <img src={type === 'seeker' ? profile.profilePictureUrl : profile.logoUrl} />
      <h2>{type === 'seeker' ? profile.fname + ' ' + profile.lname : profile.companyName}</h2>
      <p>{type === 'seeker' ? profile.currentJobTitle : profile.industry}</p>


      {type === 'seeker' && <SkillsList skills={profile.skills} />}
      {type === 'employer' && <p>{profile.companyDescription}</p>}
      
    </div>
  );
}