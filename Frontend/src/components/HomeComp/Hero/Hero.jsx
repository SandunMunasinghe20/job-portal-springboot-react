import './Hero.css';
import { useNavigate } from 'react-router-dom';

export default function Hero({ role }) {

    const navigate = useNavigate();



    return (
        <div className="Hero-container">
            <div className="hero-container">
                <div className="hero-text">
                    {role === 'seeker' ? (
                        <>
                            <h1>Find Your Dream Job</h1>
                            <p>Discover thousands of job opportunities from top companies. Start your career journey today.</p>
                            <button onClick={() => navigate('/jobs')}>Browse Jobs</button>
                        </>
                    ) : role === 'employer' ? (
                        <>
                            <h1>Find Top Talent</h1>
                            <p>Connect with skilled professionals and build your dream team. Post jobs and hire the best candidates.</p>
                            <button onClick={() => navigate('/postJobs')}>Post a Job</button>
                        </>
                    ) : (
                        <>
                            <h1>Welcome to Job Pulse</h1>
                            <p>Find jobs or hire talent with ease. Join us and unlock your career or hiring journey.</p>
                            <button onClick={() => navigate("/register")}>Get Started</button>
                        </>
                    )}

                </div>

                <div className="hero-image">
                    <img src="/hero.jpg" alt="Job Search" />
                </div>
            </div>
        </div>
    );
}