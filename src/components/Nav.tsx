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
        <Container className="flex flex-col items-start gap-3 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:py-4">
          <Link
            href="/#top"
            className="rounded font-display text-lg font-semibold tracking-tight text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            Jessica Haynes
          </Link>
          <div className="flex w-full flex-wrap items-center justify-between gap-x-4 gap-y-3 sm:w-auto sm:justify-end">
            <nav aria-label="Primary">
              <ul className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-medium text-muted sm:gap-6 sm:text-sm">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="transition-colors duration-200 hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <ThemeToggle />
          </div>
        </Container>
      </header>
    </>
  );
}
