"use client";

import {
  Component,
  lazy,
  Suspense,
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useTheme } from "@/lib/theme-store";

const RibbonRoundup = lazy(() => import("./game/RibbonRoundup"));

class GameLoadBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? (
      <p role="alert">
        The game couldn’t load. Close this window and refresh the page to try
        again.
      </p>
    ) : (
      this.props.children
    );
  }
}

function GameModal({ onClose }: { onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const close = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const element = dialog.current!;
    element.showModal();
    close.current?.focus();
    return () => {
      element.close();
      queueMicrotask(() => {
        const target = previous?.isConnected
          ? previous
          : (document.querySelector<HTMLElement>(
              'input[name="color-theme"]:checked',
            ) ?? document.querySelector<HTMLElement>("#main-content"));
        target?.focus({ preventScroll: true });
      });
    };
  }, []);
  return (
    <dialog
      ref={dialog}
      aria-labelledby={titleId}
      className="roundup-dialog"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onKeyDown={(event) => {
        if (event.key !== "Tab") return;
        const controls = Array.from(
          dialog.current!.querySelectorAll<HTMLElement>(
            'button:not(:disabled), input:not(:disabled), [tabindex="0"]',
          ),
        ).filter((element) => element.getClientRects().length > 0);
        const first = controls[0],
          last = controls.at(-1);
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }}
    >
      <div className="roundup-dialog__header">
        <h2 id={titleId} className="font-display text-xl font-semibold">
          Ribbon Roundup
        </h2>
        <button
          ref={close}
          type="button"
          className="roundup-button"
          onClick={onClose}
        >
          Close
        </button>
      </div>
      <GameLoadBoundary>
        <Suspense
          fallback={
            <p role="status" className="p-5">
              Getting the ribbons ready…
            </p>
          }
        >
          <RibbonRoundup />
        </Suspense>
      </GameLoadBoundary>
    </dialog>
  );
}

function Launcher() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        className="roundup-launcher"
        aria-haspopup="dialog"
        onClick={() => setOpen(true)}
      >
        <svg
          aria-hidden="true"
          width="20"
          height="20"
          viewBox="0 0 64 64"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinejoin="round"
        >
          <path d="M29 26C7 2 2 33 14 36c6 1 11-3 17-5m3-5C56 2 62 33 50 36c-6 1-11-3-17-5M27 34 15 57l11-4 4 6 3-23m4-2 13 23-12-5-4 7" />
          <circle cx="32" cy="29" r="6" />
        </svg>{" "}
        Take a play break
      </button>
      {open && <GameModal onClose={() => setOpen(false)} />}
    </>
  );
}

export default function RibbonRoundupLauncher() {
  return useTheme() === "pokemon" ? <Launcher /> : null;
}
