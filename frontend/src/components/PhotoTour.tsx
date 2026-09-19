"use client";

import { useEffect, useRef } from "react";
import { Icon } from "../lib/Icon";
import { listing, tourRooms } from "../data/listing";

interface Props {
  open: boolean;
  onClose: () => void;
  onOpenPhoto: (globalIndex: number) => void;
}

// Running start index of each room within the flat photo list (for lightbox numbering).
const roomOffsets = (() => {
  const offsets: number[] = [];
  let acc = 0;
  for (const r of tourRooms) { offsets.push(acc); acc += r.images.length; }
  return offsets;
})();

export function PhotoTour({ open, onClose, onOpenPhoto }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  // Reset scroll to top each time it opens.
  useEffect(() => {
    if (open && scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [open]);

  const jumpTo = (roomId: string) => {
    const el = document.getElementById(`tour-${roomId}`);
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div
      className={`tour${open ? " open" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-label="Photo tour"
      aria-hidden={!open}
      ref={dialogRef}
    >
      <header className="tour-bar">
        <button className="round-btn tour-back" aria-label="Back" type="button" onClick={onClose}>
          <span><Icon name="ui:tourBack" /></span>
        </button>
        <h2 className="tour-heading">Photo tour</h2>
        <div className="tour-actions">
          <button className="round-btn" aria-label="Share" type="button"><span><Icon name="ui:share" /></span></button>
          <button className="round-btn" aria-label="Save" type="button"><span><Icon name="ui:save" /></span></button>
        </div>
      </header>

      <div className="tour-scroll" ref={scrollRef}>
        <div className="tour-body">
          {/* Category thumbnails */}
          <nav className="tour-nav" aria-label="Photo categories">
            {tourRooms.map((r) => (
              <button key={r.id} className="tour-nav-item" type="button" aria-label={r.title} onClick={() => jumpTo(r.id)}>
                <img src={r.thumb} alt="" />
                <span className="cap">{r.title}</span>
              </button>
            ))}
          </nav>

          {/* Rooms */}
          <div className="tour-rooms">
            {tourRooms.map((room, ri) => {
              // Split images into blocks per room.layout.
              const blocks: { size: number; imgs: { src: string; alt: string; gi: number }[] }[] = [];
              let cursor = 0;
              for (const size of room.layout) {
                const imgs = room.images.slice(cursor, cursor + size).map((im, k) => ({ ...im, gi: roomOffsets[ri] + cursor + k }));
                blocks.push({ size, imgs });
                cursor += size;
              }
              return (
                <section key={room.id} id={`tour-${room.id}`} className="tour-room">
                  <div className="tour-room-head">
                    <div className="tour-room-title">{room.title}</div>
                    {room.subtitle && <div className="tour-room-sub">{room.subtitle}</div>}
                  </div>
                  <div className="tour-room-photos">
                    {blocks.map((b, bi) => (
                      <div key={bi} className={`tour-block ${b.size === 1 ? "single" : "pair"}`}>
                        {b.imgs.map((im) => (
                          <button
                            key={im.gi}
                            className="tour-photo"
                            type="button"
                            aria-label={`${listing.title} image ${im.gi + 1}`}
                            onClick={() => onOpenPhoto(im.gi)}
                          >
                            <img src={im.src} alt={im.alt} />
                          </button>
                        ))}
                      </div>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
