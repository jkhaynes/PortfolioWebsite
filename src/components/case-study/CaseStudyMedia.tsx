"use client";

import Image, { type StaticImageData } from "next/image";
import { useId, useRef } from "react";

type CaseStudyMediaProps = {
  src: StaticImageData;
  alt: string;
  title: string;
  caption?: string;
  context?: string;
  priority?: boolean;
  sizes: string;
  aspectClassName?: string;
  objectClassName?: string;
  children?: React.ReactNode;
};

type NativeCommandProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  command: "show-modal" | "close";
  commandfor: string;
};

export default function CaseStudyMedia({
  src,
  alt,
  title,
  caption,
  context,
  priority = false,
  sizes,
  aspectClassName = "aspect-[16/10]",
  objectClassName = "object-cover object-left",
  children,
}: CaseStudyMediaProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const dialogId = useId();
  const openCommandProps: NativeCommandProps = {
    command: "show-modal",
    commandfor: dialogId,
  };
  const closeCommandProps: NativeCommandProps = {
    command: "close",
    commandfor: dialogId,
  };

  function handleClose() {
    triggerRef.current?.focus();
  }

  function openDialog() {
    if (dialogRef.current && !dialogRef.current.open) {
      dialogRef.current.showModal();
    }
  }

  function closeDialog() {
    if (dialogRef.current?.open) {
      dialogRef.current.close();
    }
  }

  return (
    <figure className="min-w-0">
      <button
        ref={triggerRef}
        type="button"
        {...openCommandProps}
        onClick={openDialog}
        aria-label={`View larger: ${title}`}
        className="group block w-full rounded-[2rem] text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
      >
        <span
          className={`relative block overflow-hidden rounded-[2rem] border border-foreground/15 bg-product-ink shadow-product ${aspectClassName}`}
        >
          <Image
            src={src}
            alt={alt}
            fill
            priority={priority}
            sizes={sizes}
            className={objectClassName}
          />
          {children}
          <span className="absolute bottom-3 right-3 rounded-full bg-product-ink/90 px-3 py-1.5 text-xs font-semibold text-white shadow-md transition-colors group-hover:bg-accent">
            View larger
          </span>
        </span>
      </button>
      {(caption || context) && (
        <figcaption className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-muted">
          {caption && <span>{caption}</span>}
          {context && <span>{context}</span>}
        </figcaption>
      )}

      <dialog
        id={dialogId}
        ref={dialogRef}
        aria-label={title}
        onClose={handleClose}
        className="media-dialog m-auto max-h-[calc(100dvh-2rem)] w-[calc(100vw-2rem)] max-w-[96rem] overflow-hidden overscroll-contain rounded-[2rem] border border-white/15 bg-product-ink p-0 text-white shadow-product"
      >
        <div className="flex items-center justify-between gap-4 border-b border-white/15 px-5 py-4">
          <h2 className="font-display text-lg font-semibold">{title}</h2>
          <button
            ref={closeRef}
            type="button"
            {...closeCommandProps}
            onClick={closeDialog}
            autoFocus
            className="rounded-full border border-white/30 px-4 py-2 text-sm font-semibold transition-colors hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-soft"
          >
            Close
          </button>
        </div>
        <div className="max-h-[calc(100dvh-8rem)] overflow-auto overscroll-contain p-3 sm:p-5">
          <Image
            src={src}
            alt={alt}
            sizes="(min-width: 1536px) 1440px, calc(100vw - 4rem)"
            className="mx-auto h-auto min-w-[min(100%,48rem)] max-w-none rounded-xl"
          />
          {(caption || context) && (
            <p className="mx-auto mt-4 max-w-4xl text-sm leading-relaxed text-white/70">
              {[caption, context].filter(Boolean).join(" · ")}
            </p>
          )}
        </div>
      </dialog>
    </figure>
  );
}
