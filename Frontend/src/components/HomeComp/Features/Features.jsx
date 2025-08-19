import "./Features.css";

export default function Features({ role }) {
  const features = [
    {
      icon: "🎯",
      title: "Smart Job Matching",
      description:
        "Our system matches you with the perfect job opportunities based on your skills and preferences.",
    },
    {
      icon: "⚡",
      title: "Quick Applications",
      description:
        "Apply to multiple jobs with one click using your saved profile and resume.",
    },
    {
      icon: "🔍",
      title: "Advanced Search",
      description:
        "Filter jobs by location, salary, company size, and more to find exactly what you're looking for.",
    },
    {
      icon: "📊",
      title: "Real-time Analytics",
      description:
        "Track your application progress and get insights into your job search performance.",
    },
    {
      icon: "🤝",
      title: "Direct Communication",
      description:
        "Connect directly with hiring managers and get faster responses to your applications.",
    },
    /*{
      icon: "🎓",
      title: "Career Development",
      description:
        "Access resources, courses, and tips to enhance your skills and advance your career.",
    },*/
  ];

  const empFeatures = [
    {
      icon: "👥",
      title: "Talent Pool Access",
      description:
        "Access a vast database of qualified candidates and find the perfect match for your team.",
    },
    {
      icon: "🚀",
      title: "Easy Job Posting",
      description:
        "Post jobs quickly with our intuitive interface and reach thousands of job seekers instantly.",
    },
    {
      icon: "🎯",
      title: "Targeted Recruitment",
      description:
        "Use advanced filters to find candidates with specific skills, experience, and qualifications.",
    },
    {
      icon: "📈",
      title: "Hiring Analytics",
      description:
        "Track your recruitment metrics and optimize your hiring process with detailed insights.",
    },
    {
      icon: "⚡",
      title: "Fast Communication",
      description:
        "Connect with candidates instantly and streamline your interview scheduling process.",
    },
    {
      icon: "💼",
      title: "Employer Branding",
      description:
        "Showcase your company culture and values to attract top talent and build your employer brand.",
    },
  ];

  return (
    <div className="features-container">
      <div className="features-content">
        <h2>Why Choose Job Pulse?</h2>
        <p>
          {role === "seeker"
            ? "Discover the features that make your job search easier and more effective"
            : "Discover the features that make your hiring process faster and more efficient"}
        </p>

        <div className="features-grid">
          {(role === "seeker" ? features : empFeatures).map(
            (feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
