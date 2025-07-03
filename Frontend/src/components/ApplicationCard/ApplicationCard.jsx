

import './ApplicationCard.css';

export default function ApplicationCard({ applications }) {
    return (
        <div className='ApplicationCard-container'>
            {applications.map((app, index) => (
                <div key={index} className="application-item">
                    <p><strong>Job Title:</strong> {app.jobTitle}</p>
                    <p><strong>Company:</strong> {app.companyName}</p>
                    <p>
                        <strong>Resume:</strong>{' '}
                        <a href={app.resume} target="_blank" rel="noopener noreferrer">
                            View Resume
                        </a>
                    </p>
                    <p><strong>Status:</strong> {app.status}</p>
                    <p><strong>Applied At:</strong> {new Date(app.appliedAt).toLocaleString()}</p>
                </div>
            ))}
        </div>
    );
}
