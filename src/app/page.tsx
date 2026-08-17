import Button from "@/components/Button";
import Card from "@/components/Card";
import Container from "@/components/Container";
import Nav from "@/components/Nav";

export default function Home() {
  return (
    <>
      <Nav />
      <main id="top" className="flex min-h-[70vh] items-center justify-center py-24">
        <Container>
          <Card className="mx-auto max-w-md text-center">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-accent">
              Foundation in progress
            </p>
            <h1 className="font-display text-2xl font-semibold text-foreground">
              The real site is on its way
            </h1>
            <p className="mt-3 text-muted">
              The design system and layout are set up first. Sections like
              Projects and Experience are coming next.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Button href="#top" variant="primary">
                Primary style
              </Button>
              <Button href="#top" variant="secondary">
                Secondary style
              </Button>
            </div>
          </Card>
        </Container>
      </main>
    </>
  );
}
