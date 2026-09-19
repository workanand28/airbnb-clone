"use client";

import { useEffect, useState } from "react";
import { listing } from "../data/listing";

const SECTIONS = [
  { id: "photos", label: "Photos" },
  { id: "amenities", label: "Amenities" },
  { id: "reviews", label: "Reviews" },
  { id: "location", label: "Location" },
];

export function SubNav({ onReserve }: { onReserve: () => void }) {
  const [show, setShow] = useState(false);
  const [active, setActive] = useState("amenities");

  useEffect(() => {
    // Show the sticky bar once the hero has scrolled past.
    const onScroll = () => setShow(window.scrollY > 520);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    // Highlight the section currently near the top of the viewport.
    const ids = SECTIONS.map((s) => s.id);
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(e.target.id);
        }
      },
      { rootMargin: "-80px 0px -70% 0px", threshold: 0 }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <div className={`subnav${show ? " show" : ""}`} aria-hidden={!show}>
      <div className="subnav-inner">
        <nav className="subnav-links" aria-label="Listing sections">
          {SECTIONS.map((s) => (
            <a key={s.id} href={`#${s.id}`} className={active === s.id ? "active" : ""}>
              {s.label}
            </a>
          ))}
        </nav>
        <div className="subnav-right">
          <div className="subnav-price">
            <div>
              <span className="amt">{listing.price}</span> <span className="per">{listing.priceNights}</span>
            </div>
            <div className="sub">
              <span className="subnav-star"><StarSm /></span>
              <span>{listing.rating}</span> ·
              <span>{listing.reviewCount} reviews</span>
            </div>
          </div>
          <button className="btn-reserve small" type="button" onClick={onReserve}>
            Reserve
          </button>
        </div>
      </div>
    </div>
  );
}

function StarSm() {
  return (
    <svg viewBox="0 0 32 32" style={{ display: "block", height: "100%", width: "100%", fill: "currentColor" }} aria-hidden="true">
      <path d="M15.1 1.58l-4.13 8.88-9.86 1.27a1 1 0 0 0-.54 1.74l7.3 6.57-1.97 9.85a1 1 0 0 0 1.48 1.06l8.62-5 8.63 5a1 1 0 0 0 1.48-1.06l-1.97-9.85 7.3-6.57a1 1 0 0 0-.55-1.73l-9.86-1.28-4.12-8.88a1 1 0 0 0-1.82 0z" />
    </svg>
  );
}
