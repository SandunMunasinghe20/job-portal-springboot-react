import './Hero.css';
import { useNavigate } from 'react-router-dom';

export default function Hero({ role }) {

    const navigate = useNavigate();
    const postJob = () => {
        navigate('/postJobs')
    }


    return (
        <div className="Hero-container">
            <div className="hero-container">
                <div className="hero-text">
                    {role === 'seeker' ? (
                        <>
                            <h1>Find Your Dream Job</h1>
                            <p>Discover thousands of job opportunities from top companies. Start your career journey today.</p>
                            <button>Browse Jobs</button>
                        </>
                    ) : (
                        <>
                            <h1>Find Top Talent</h1>
                            <p>Connect with skilled professionals and build your dream team. Post jobs and hire the best candidates.</p>
                            <button onClick={postJob}>Post a Job</button>
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