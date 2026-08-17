export default function ExternalLinkMark() {
  return (
    <>
      <svg
        aria-hidden="true"
        viewBox="0 0 16 16"
        className="ml-1.5 inline h-3 w-3 -translate-y-px"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.75}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M6 3.5h6.5V10M12.5 3.5 3.5 12.5" />
      </svg>
      <span className="sr-only"> (opens in a new tab)</span>
    </>
  );
}
