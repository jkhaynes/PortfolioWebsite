import type { Metadata } from "next";
import Container from "@/components/Container";
import Nav from "@/components/Nav";

const title = "Privacy Policy | Jessica Haynes";
const description =
  "Privacy policy for job-hunt-pipeline, a personal tool that reads the owner's LinkedIn job alert emails and sends her a daily summary.";

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: "/privacy",
  },
  openGraph: {
    title,
    description,
    url: "/privacy",
    siteName: "Jessica Haynes",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

export default function PrivacyPage() {
  return (
    <>
      <Nav />
      <main id="main-content" tabIndex={-1} className="pb-24">
        <Container>
          <article className="max-w-2xl pt-12 text-lg leading-relaxed text-foreground">
            <h1 className="text-balance font-display text-4xl font-semibold leading-tight sm:text-5xl">
              Privacy policy
            </h1>
            <p className="mt-2 text-base text-accent-secondary">
              Last updated September 24, 2026
            </p>

            <h2 className="mt-10 font-display text-2xl font-semibold">
              job-hunt-pipeline
            </h2>
            <p className="mt-4">
              job-hunt-pipeline is a personal tool used only by its owner,
              Jessica Haynes. It reads LinkedIn job alert emails in the
              owner&apos;s Gmail account and sends a daily summary email to the
              owner.
            </p>
            <p className="mt-4">
              It does not collect, store, or share data from any other person.
              Job posting details are processed by the Anthropic API to score
              and summarize roles. Nothing is sold or shared with third
              parties.
            </p>
            <p className="mt-4">
              Questions:{" "}
              <a
                href="mailto:jkhaynes2390@gmail.com"
                className="text-accent underline underline-offset-2"
              >
                jkhaynes2390@gmail.com
              </a>
            </p>
          </article>
        </Container>
      </main>
    </>
  );
}
