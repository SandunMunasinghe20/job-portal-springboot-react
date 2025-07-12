//import './MyProfile.css';
import NavBar from './HomeComp/NavBar/NavBar';
import { useEffect, useState } from 'react';

export default function MyProfile() {
    console.log("MyProfile component rendered");
    const [display, setDisplay] = useState("");
    const [index, setIndex] = useState(0);
    const [currentRoleIndex, setCurrentRoleIndex] = useState(0);

    // Consolidated profile data with no duplications
    const profileData = {
        name: "Sandun Lashan",
        location: "Colombo, Sri Lanka",
        yearsExp: "3+",
        email: "sandun.lashan@email.com",
        phone: "+94 77 123 4567",
        linkedin: "linkedin.com/in/sandunlashan",
        github: "github.com/sandunlashan",

        roles: [
            "Fullstack Developer.",
            "Software Engineer.",
            "UI/UX Designer.",
            "Problem Solver."
        ],

        summary: "Passionate fullstack developer with 3+ years of experience in modern web technologies. Specialized in React, Node.js, and cloud technologies. I create innovative solutions that bridge the gap between creative design and robust functionality, delivering exceptional user experiences through clean, efficient code.",

        skills: {
            frontend: ["React", "Vue.js", "TypeScript", "HTML5", "CSS3", "Tailwind CSS", "Redux", "Next.js"],
            backend: ["Node.js", "Express", "Python", "Django", "PHP", "Laravel", "REST APIs", "GraphQL"],
            database: ["MongoDB", "PostgreSQL", "MySQL", "Redis", "Firebase"],
            tools: ["Git", "Docker", "AWS", "Vercel", "Figma", "Postman", "VS Code", "Linux"]
        },

        workExperience: [
            {
                title: "Senior Fullstack Developer",
                company: "TechCorp Solutions",
                duration: "Jan 2023 - Present",
                location: "Colombo, Sri Lanka",
                achievements: [
                    "Led development of 5+ web applications using React and Node.js",
                    "Improved application performance by 40% through code optimization",
                    "Mentored junior developers and conducted code reviews",
                    "Collaborated with cross-functional teams to deliver projects on time"
                ]
            },
            {
                title: "Fullstack Developer",
                company: "Digital Innovations Ltd",
                duration: "Jun 2021 - Dec 2022",
                location: "Colombo, Sri Lanka",
                achievements: [
                    "Developed and maintained e-commerce platforms serving 10k+ users",
                    "Implemented responsive designs and improved mobile experience",
                    "Integrated third-party APIs and payment gateways",
                    "Reduced bug reports by 60% through comprehensive testing"
                ]
            }
        ],

        education: [
            {
                degree: "Bachelor of Science in Computer Science",
                institution: "University of Colombo",
                duration: "2017 - 2021",
                grade: "First Class Honours"
            }
        ],

        featuredProjects: [
            {
                name: "E-Commerce Platform",
                technologies: ["React", "Node.js", "MongoDB", "Stripe"],
                description: "Full-featured e-commerce platform with admin dashboard, payment integration, and inventory management."
            },
            {
                name: "Task Management App",
                technologies: ["Vue.js", "Express", "PostgreSQL", "Socket.io"],
                description: "Real-time collaborative task management application with team features and notifications."
            },
            {
                name: "Portfolio Website",
                technologies: ["Next.js", "Tailwind CSS", "Framer Motion"],
                description: "Responsive portfolio website with animations and optimized performance."
            }
        ],

        certifications: [
            "AWS Certified Developer - Associate",
            "Google Cloud Professional Developer",
            "MongoDB Certified Developer"
        ]
    };

    // Typewriter effect for roles
    useEffect(() => {
        const currentRole = profileData.roles[currentRoleIndex];
        let timer;

        if (index < currentRole.length) {
            timer = setTimeout(() => {
                setDisplay(prev => prev + currentRole.charAt(index));
                setIndex(prev => prev + 1);
            }, 100);
        } else {
            timer = setTimeout(() => {
                setDisplay("");
                setIndex(0);
                setCurrentRoleIndex(prev => (prev + 1) % profileData.roles.length);
            }, 2000);
        }

        return () => clearTimeout(timer);
    }, [index, currentRoleIndex, profileData.roles]);

    // Reusable contact info component
    const ContactInfo = ({ icon, text }) => (
        <div className='contact-item'>
            <span className='contact-icon'>{icon}</span>
            <span>{text}</span>
        </div>
    );

    // Reusable skill tag component
    const SkillTag = ({ skill, category }) => (
        <span className={`skill-tag ${category}`}>
            {skill}
        </span>
    );

    return (
        <>
            <NavBar />
            <div className='profile-wrapper'>

                {/* Hero Section */}
                <div className='hero-section'>
                    <div className='hero-content'>
                        <div className='hero-text'>
                            <h1 className='welcome-msg'>
                                Hello, I'm <span className='username'>{profileData.name}</span>
                            </h1>
                            <h2 className='job-intro'>
                                I'm a <span className='my-role'>{display}</span>
                            </h2>
                            <p className='job-description'>
                                {profileData.summary}
                            </p>
                            <div className='contact-info'>
                                <ContactInfo icon="📍" text={profileData.location} />
                                <ContactInfo icon="💼" text={`${profileData.yearsExp} Years Experience`} />
                                <ContactInfo icon="📧" text={profileData.email} />
                            </div>
                        </div>
                        <div className='hero-image'>
                            <img
                                src='profile.jpg'
                                alt={`${profileData.name} - Profile Picture`}
                                className='profile-pic'
                                loading="lazy"
                            />
                        </div>
                    </div>
                </div>

                {/* Technical Skills Section */}
                <section className='section skills-section'>
                    <div className='section-container'>
                        <h2 className='section-title'>Technical Skills</h2>
                        <div className='skills-grid'>
                            {Object.entries(profileData.skills).map(([category, skillList]) => (
                                <div key={category} className='skill-category'>
                                    <h3 className='skill-category-title'>
                                        {category.charAt(0).toUpperCase() + category.slice(1)}
                                    </h3>
                                    <div className='skill-tags'>
                                        {skillList.map((skill, index) => (
                                            <SkillTag
                                                key={index}
                                                skill={skill}
                                                category={category}
                                            />
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Professional Experience Section */}
                <section className='section experience-section'>
                    <div className='section-container'>
                        <h2 className='section-title'>Professional Experience</h2>
                        <div className='experience-timeline'>
                            {profileData.workExperience.map((job, index) => (
                                <div key={index} className='experience-item'>
                                    <div className='experience-marker'></div>
                                    <div className='experience-content'>
                                        <div className='experience-header'>
                                            <h3 className='experience-title'>{job.title}</h3>
                                            <span className='experience-duration'>{job.duration}</span>
                                        </div>
                                        <div className='experience-company'>
                                            <span className='company-name'>{job.company}</span>
                                            <span className='company-location'>{job.location}</span>
                                        </div>
                                        <ul className='experience-responsibilities'>
                                            {job.achievements.map((achievement, idx) => (
                                                <li key={idx}>{achievement}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Featured Projects Section */}
                <section className='section projects-section'>
                    <div className='section-container'>
                        <h2 className='section-title'>Featured Projects</h2>
                        <div className='projects-grid'>
                            {profileData.featuredProjects.map((project, index) => (
                                <div key={index} className='project-card'>
                                    <h3 className='project-name'>{project.name}</h3>
                                    <p className='project-description'>{project.description}</p>
                                    <div className='project-tech'>
                                        {project.technologies.map((tech, idx) => (
                                            <span key={idx} className='tech-tag'>{tech}</span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Education & Certifications */}
                <section className='section education-section'>
                    <div className='section-container'>
                        <div className='education-grid'>
                            <div className='education-column'>
                                <h2 className='section-title'>Education</h2>
                                {profileData.education.map((edu, index) => (
                                    <div key={index} className='education-item'>
                                        <h3 className='education-degree'>{edu.degree}</h3>
                                        <p className='education-institution'>{edu.institution}</p>
                                        <div className='education-details'>
                                            <span className='education-duration'>{edu.duration}</span>
                                            <span className='education-grade'>{edu.grade}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className='certifications-column'>
                                <h2 className='section-title'>Certifications</h2>
                                <div className='certifications-list'>
                                    {profileData.certifications.map((cert, index) => (
                                        <div key={index} className='certification-item'>
                                            <span className='certification-icon'>🏆</span>
                                            <span className='certification-name'>{cert}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
}