const portfolioData = {
  name: "Khushi Agarwal", // Replace with your full name
  role: "Full-Stack Web Developer", // Replace with your title or major
  tagline: "I build responsive, user-friendly web applications using modern JavaScript frameworks.",
  about:
    "I am a Computer Science student passionate about frontend and backend development. I enjoy solving real-world problems through clean code and intuitive design.",
  email: "agr.khushi04@gmail.com",
  github: "https://github.com/ImAgarwal",
  linkedin: "https://www.linkedin.com/in/khushi-agarwal-b75770249",
  skills: ["HTML", "CSS", "JavaScript", "React", "Node.js", "MongoDB", "Git"],
  projects: [
    {
      name: "E-Commerce Storefront",
      description: "A full-stack shopping app with cart management, checkout flow, and a seller dashboard.",
      tech: "React, Node.js, MongoDB",
      link: "https://github.com/ecommerce-app"
    },
    {
      name: "University Finder",
      description: "Search and filter universities worldwide by country using a public REST API.",
      tech: "React, REST API, CSS",
      link: "https://github.com/university-finder"
    },
    {
      name: "Product Manager",
      description: "CRUD inventory dashboard allowing sellers to add, view, edit, and delete products.",
      tech: "JavaScript, Express, MongoDB",
      link: "https://github.com/product-manager"
    }
  ]
};

export default function App() {
  return (
    <div>
      <header className="hero">
        <nav>
          <a href="#about">About</a>
          <a href="#skills">Skills</a>
          <a href="#projects">Projects</a>
          <a href="#contact">Contact</a>
        </nav>
        <p className="eyebrow">HELLO, I'M</p>
        <h1>{portfolioData.name}</h1>
        <h2>{portfolioData.role}</h2>
        <p>{portfolioData.tagline}</p>
        <a className="button" href="#projects">View my work</a>
      </header>

      <main>
        <section id="about">
          <h2>About Me</h2>
          <p>{portfolioData.about}</p>
        </section>

        <section id="skills">
          <h2>My Skills</h2>
          <div className="chips">
            {portfolioData.skills.map((skill) => (
              <span key={skill}>{skill}</span>
            ))}
          </div>
        </section>

        <section id="projects">
          <h2>My Projects</h2>
          <div className="cards">
            {portfolioData.projects.map((project) => (
              <article key={project.name}>
                <h3>{project.name}</h3>
                <p>{project.description}</p>
                <p><strong>Tech:</strong> {project.tech}</p>
                <a href={project.link} target="_blank" rel="noreferrer">
                  View Code →
                </a>
              </article>
            ))}
          </div>
        </section>

        <section id="contact">
          <h2>Contact Me</h2>
          <p>
            Email: <a href={`mailto:${portfolioData.email}`}>{portfolioData.email}</a>
          </p>
          <p>
            <a href={portfolioData.github} target="_blank" rel="noreferrer">GitHub</a>{" | "}
            <a href={portfolioData.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
          </p>
        </section>
      </main>

      <footer>
        © {new Date().getFullYear()} {portfolioData.name}. Built with React.
      </footer>
    </div>
  );
}
