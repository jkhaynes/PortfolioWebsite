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
  type RefObject,
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

function GameModal({
  onClose,
  triggerRef,
}: {
  onClose: () => void;
  triggerRef: RefObject<HTMLButtonElement | null>;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const close = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  useEffect(() => {
    // WebKit does not necessarily focus a button when it is clicked.
    const previous = triggerRef.current;
    const element = dialog.current!;
    element.showModal();
    close.current?.focus();
    return () => {
      element.close();
      queueMicrotask(() => {
        // React's development effect replay must not steal dialog focus.
        if (element.isConnected) return;
        const target = previous?.getClientRects().length
          ? previous
          : (document.querySelector<HTMLElement>(
              'input[name="color-theme"]:checked',
            ) ?? document.querySelector<HTMLElement>("#main-content"));
        target?.focus({ preventScroll: true });
      });
    };
  }, [triggerRef]);
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

export default function RibbonRoundupLauncher() {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  // The badge is always in the markup and CSS shows it only in Pokémon, so the
  // theme attribute set before paint decides visibility with no flicker. It
  // stays mounted (hidden by CSS) outside Pokémon, so a theme change must
  // dismiss the game itself.
  const pokemon = useTheme() === "pokemon";
  if (!pokemon && open) setOpen(false);
  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className="roundup-launcher roundup-launcher--badge"
        aria-haspopup="dialog"
        onClick={() => setOpen(true)}
      >
        <span className="roundup-launcher__bow" aria-hidden="true" />
        Take a play break
        <span className="roundup-launcher__sub" aria-hidden="true">
          · a Sylveon mini game
        </span>
      </button>
      {open && (
        <GameModal triggerRef={triggerRef} onClose={() => setOpen(false)} />
      )}
    </>
  );
}
