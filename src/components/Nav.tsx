import Link from "next/link";
import Container from "@/components/Container";
import ThemeToggle from "@/components/ThemeToggle";

type NavLink = {
  label: string;
  href: string;
};

// Each future feature should append its own section's link here
// at the same time it adds that section to the page.
const navLinks: NavLink[] = [
  { label: "Home", href: "/#top" },
  { label: "Projects", href: "/#projects" },
  { label: "Experience", href: "/#experience" },
  { label: "Contact", href: "/#contact" },
];

export default function Nav() {
  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <header className="sticky top-0 z-50 border-b border-border/70 bg-background/80 backdrop-blur-md">
        <Container className="site-nav-layout">
          <Link
            href="/#top"
            className="portfolio-brand flex min-h-11 items-center rounded font-display text-lg font-semibold tracking-tight text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            Jessica Haynes
          </Link>
          <nav aria-label="Primary" className="site-nav-primary">
            <ul className="site-nav-links">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="site-nav-link">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="site-nav-theme">
            <ThemeToggle />
          </div>
        </Container>
      </header>
    </>
  );
}
