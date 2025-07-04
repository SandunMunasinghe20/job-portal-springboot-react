import './Footer.css'

export default function Footer({ role }) {
    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-section">
                    <div className="footer-brand">
                        <h3>Job Pulse</h3>
                        <p>Connecting talent with opportunity</p>
                    </div>
                </div>
                {role === 'seeker'
                    &&
                    <div className="footer-section">
                        <h4>For Job Seekers</h4>
                        <ul>
                            <li><a href="/jobs">Browse Jobs</a></li>
                            <li><a href="/profile">My Profile</a></li>
                            <li><a href="/myApplications">Applications</a></li>
                            <li><a href="/career-resources">Career Resources</a></li>
                        </ul>
                    </div>
                }
                {role === 'employer'
                    &&
                    <div className="footer-section">
                        <h4>For Employers</h4>
                        <ul>
                            <li><a href="/postJobs">Post a Job</a></li>
                            <li><a href="/candidates">Find Candidates</a></li>
                            <li><a href="/analytics">Hiring Analytics</a></li>
                            <li><a href="/employer-branding">Employer Branding</a></li>
                        </ul>
                    </div>
                }
                <div className="footer-section">
                    <h4>Company</h4>
                    <ul>
                        <li><a href="/about">About Us</a></li>
                        <li><a href="/careers">Careers</a></li>
                        <li><a href="/press">Press</a></li>
                        <li><a href="/contact">Contact</a></li>
                    </ul>
                </div>

                <div className="footer-section">
                    <h4>Support</h4>
                    <ul>
                        <li><a href="/help">Help Center</a></li>
                        <li><a href="/privacy">Privacy Policy</a></li>
                        <li><a href="/terms">Terms of Service</a></li>
                        <li><a href="/security">Security</a></li>
                    </ul>
                </div>
            </div>

            <div className="footer-bottom">
                <div className="footer-bottom-content">
                    <p>&copy; 2025 Job Pulse. All rights reserved.</p>
                    <div className="social-links">
                        <a href="#" aria-label="Facebook">📘</a>
                        <a href="#" aria-label="Twitter">🐦</a>
                        <a href="#" aria-label="LinkedIn">💼</a>
                        <a href="#" aria-label="Instagram">📸</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}