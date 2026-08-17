import Container from "@/components/Container";

type NavLink = {
  label: string;
  href: string;
};

// Each future feature should append its own section's link here
// at the same time it adds that section to the page.
const navLinks: NavLink[] = [{ label: "Home", href: "#top" }];

export default function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/80 backdrop-blur-md">
      <Container className="flex flex-wrap items-center justify-between gap-4 py-4">
        <a
          href="#top"
          className="rounded font-display text-lg font-semibold tracking-tight text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          Jessica Haynes
        </a>
        <nav aria-label="Primary">
          <ul className="flex flex-wrap items-center gap-6 text-sm font-medium text-muted">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="transition-colors duration-200 hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </Container>
    </header>
  );
}
