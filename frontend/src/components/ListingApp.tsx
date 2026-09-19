"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Header } from "./Header";
import { SubNav } from "./SubNav";
import { ListingContent } from "./ListingContent";
import { PhotoTour } from "./PhotoTour";
import { Lightbox } from "./Lightbox";
import { AmenitiesModal } from "./AmenitiesModal";
import { allPhotos } from "../data/listing";

interface UiState {
  tour: boolean;
  photo: number | null;
  amen: boolean;
}

const BASE: UiState = { tour: false, photo: null, amen: false };

export function ListingApp() {
  const [ui, setUi] = useState<UiState>(BASE);
  const [toast, setToast] = useState<{ msg: string; k: number } | null>(null);
  const lastFocused = useRef<HTMLElement | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const anyOpen = ui.tour || ui.photo !== null || ui.amen;

  /* ---- history-synced state transitions (browser back closes overlays) ---- */
  useEffect(() => {
    history.replaceState({ ui: BASE }, "");
    const onPop = (e: PopStateEvent) => setUi((e.state?.ui as UiState) ?? BASE);
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const push = useCallback((next: UiState, url?: string) => {
    history.pushState({ ui: next }, "", url);
    setUi(next);
  }, []);

  const replace = useCallback((next: UiState, url?: string) => {
    history.replaceState({ ui: next }, "", url);
    setUi(next);
  }, []);

  const openTour = useCallback(() => {
    lastFocused.current = document.activeElement as HTMLElement;
    push({ tour: true, photo: null, amen: false }, "?view=photos");
  }, [push]);

  const openPhoto = useCallback((index: number) => {
    lastFocused.current = document.activeElement as HTMLElement;
    // If opened directly from the listing page, keep the tour underneath.
    push({ tour: true, photo: index, amen: false }, `?view=photos&photo=${index + 1}`);
  }, [push]);

  const navPhoto = useCallback((index: number) => {
    replace({ tour: true, photo: index, amen: false }, `?view=photos&photo=${index + 1}`);
  }, [replace]);

  const openAmenities = useCallback(() => {
    lastFocused.current = document.activeElement as HTMLElement;
    push({ tour: false, photo: null, amen: true }, "?view=amenities");
  }, [push]);

  const back = useCallback(() => history.back(), []);

  const showToast = useCallback((msg: string) => {
    setToast({ msg, k: Date.now() });
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2400);
  }, []);

  /* ---- scroll lock ---- */
  useEffect(() => {
    document.body.classList.toggle("modal-open", anyOpen);
  }, [anyOpen]);

  /* ---- keyboard: Escape closes topmost, arrows navigate lightbox, Tab enables focus rings ---- */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Tab") document.body.classList.add("kbd");
      if (!anyOpen) return;
      if (e.key === "Escape") { e.preventDefault(); back(); return; }
      if (ui.photo !== null) {
        if (e.key === "ArrowRight" && ui.photo < allPhotos.length - 1) { e.preventDefault(); navPhoto(ui.photo + 1); }
        if (e.key === "ArrowLeft" && ui.photo > 0) { e.preventDefault(); navPhoto(ui.photo - 1); }
      }
    };
    const onMouse = () => document.body.classList.remove("kbd");
    window.addEventListener("keydown", onKey);
    window.addEventListener("mousedown", onMouse);
    return () => { window.removeEventListener("keydown", onKey); window.removeEventListener("mousedown", onMouse); };
  }, [anyOpen, ui.photo, back, navPhoto]);

  /* ---- focus management: move focus into the topmost open dialog; restore on close ---- */
  useEffect(() => {
    const sel = ui.amen ? ".amen-modal" : ui.photo !== null ? ".lightbox" : ui.tour ? ".tour" : null;
    if (sel) {
      const dialog = document.querySelector<HTMLElement>(sel);
      const focusable = dialog?.querySelector<HTMLElement>("button:not([disabled]), a[href], [tabindex]");
      // Defer so the element is visible before focusing.
      const t = setTimeout(() => focusable?.focus(), 60);
      return () => clearTimeout(t);
    } else if (lastFocused.current) {
      lastFocused.current.focus?.();
      lastFocused.current = null;
    }
  }, [ui.amen, ui.photo, ui.tour]);

  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <Header />
      <SubNav onReserve={() => showToast("Reserved! (demo)")} />
      <ListingContent
        onOpenTour={openTour}
        onOpenPhoto={openPhoto}
        onOpenAmenities={openAmenities}
        onReserve={() => showToast("Reserved! (demo)")}
        onToast={showToast}
      />

      <PhotoTour open={ui.tour} onClose={back} onOpenPhoto={openPhoto} />
      <Lightbox index={ui.photo} onClose={back} onNav={navPhoto} onShowAll={back} />
      <AmenitiesModal open={ui.amen} onClose={back} />

      <div className={`toast${toast ? " show" : ""}`} role="status" key={toast?.k}>
        {toast?.msg}
      </div>
    </>
  );
}
