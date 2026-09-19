import Link from "next/link";
import Container from "@/components/Container";
import ExternalLinkMark from "@/components/ExternalLinkMark";
import NavLinks from "@/components/NavLinks";
import ThemeToggle from "@/components/ThemeToggle";

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
            <NavLinks />
          </nav>
          <div className="site-nav-theme">
            <a
              href="/Jessica_Haynes_Resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              data-umami-event="resume_download"
              className="site-nav-resume"
            >
              Résumé
              <ExternalLinkMark />
            </a>
            <ThemeToggle />
          </div>
        </Container>
      </header>
    </>
  );
}
