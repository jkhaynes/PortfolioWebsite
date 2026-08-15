const sections = [
  {
    title: "About",
    description:
      "A concise introduction to my engineering background, the kinds of problems I enjoy solving, and the direction I am exploring next.",
  },
  {
    title: "Projects",
    description:
      "Selected engineering work, including hands-on projects that explore modern AI-powered application development.",
  },
  {
    title: "Experience",
    description:
      "A focused view of the teams, systems, and engineering outcomes that have shaped my experience.",
  },
  {
    title: "Currently Exploring",
    description:
      "Topics and tools I am actively learning through practical projects and experimentation.",
  },
];

export default function Home() {
  return (
    <main>
      <section className="hero">
        <p className="eyebrow">Senior Software Engineer · C# / .NET</p>
        <h1>Jessica Haynes</h1>
        <p className="lede">
          I build reliable software and am actively exploring how AI can be
          incorporated into thoughtful, real-world development.
        </p>
        <div className="actions">
          <a href="#projects">View Projects</a>
          <a className="secondary" href="#contact">
            Get in Touch
          </a>
        </div>
      </section>

      <section className="grid" aria-label="Website sections">
        {sections.map((section) => (
          <article
            className="card"
            id={section.title === "Projects" ? "projects" : undefined}
            key={section.title}
          >
            <h2>{section.title}</h2>
            <p>{section.description}</p>
          </article>
        ))}
      </section>

      <section className="contact" id="contact">
        <p className="eyebrow">Contact</p>
        <h2>Let&apos;s connect.</h2>
        <p>
          This starter intentionally keeps content minimal until the project PRD
          defines the final site direction.
        </p>
      </section>
    </main>
  );
}
