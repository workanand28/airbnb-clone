"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "../lib/Icon";
import { allPhotos, listing } from "../data/listing";

interface Props {
  index: number | null;
  onClose: () => void;
  onNav: (next: number) => void;
  onShowAll: () => void;
}

export function Lightbox({ index, onClose, onNav, onShowAll }: Props) {
  const open = index !== null;
  const [fadeKey, setFadeKey] = useState(0);
  const prevIndex = useRef<number | null>(null);

  // Re-trigger the fade animation whenever the shown photo changes.
  useEffect(() => {
    if (index !== null && index !== prevIndex.current) {
      setFadeKey((k) => k + 1);
      prevIndex.current = index;
    }
  }, [index]);

  const total = allPhotos.length;
  const photo = open ? allPhotos[index!] : null;
  const atStart = index === 0;
  const atEnd = index === total - 1;

  return (
    <div className={`lightbox${open ? " open" : ""}`} role="dialog" aria-modal="true" aria-label="Photo viewer" aria-hidden={!open}>
      <header className="lb-bar">
        <button className="round-btn lb-grid-btn" aria-label="Show all photos" type="button" onClick={onShowAll}>
          <span><Icon name="ui:lbGrid" /></span>
        </button>
        <div className="lb-title" />
        <div className="lb-right">
          <span className="lb-counter">{open ? `${index! + 1} / ${total}` : ""}</span>
          <button className="round-btn" aria-label="Close" type="button" onClick={onClose}>
            <span><Icon name="ui:lbClose" /></span>
          </button>
        </div>
      </header>

      <button
        className="round-btn lb-arrow prev"
        aria-label="Previous"
        type="button"
        disabled={atStart}
        onClick={() => !atStart && onNav(index! - 1)}
      >
        <span><Icon name="ui:lbPrev" /></span>
      </button>

      <div className="lb-stage">
        {photo && (
          <img key={fadeKey} className="fade" src={photo.src} alt={`${listing.title} image ${index! + 1}`} />
        )}
      </div>

      <button
        className="round-btn lb-arrow next"
        aria-label="Next"
        type="button"
        disabled={atEnd}
        onClick={() => !atEnd && onNav(index! + 1)}
      >
        <span><Icon name="ui:lbNext" /></span>
      </button>
    </div>
  );
}
