"use client";

import { useEffect, useRef } from "react";
import { Icon } from "../lib/Icon";
import { amenityGroups } from "../data/listing";

interface Props {
  open: boolean;
  onClose: () => void;
}

export function AmenitiesModal({ open, onClose }: Props) {
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && bodyRef.current) bodyRef.current.scrollTop = 0;
  }, [open]);

  return (
    <div
      className={`amen-overlay${open ? " open" : ""}`}
      aria-hidden={!open}
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="amen-modal" role="dialog" aria-modal="true" aria-label="What this place offers">
        <div className="amen-bar">
          <button className="round-btn amen-close" aria-label="Close" type="button" onClick={onClose}>
            <span><Icon name="ui:lbClose" /></span>
          </button>
        </div>
        <div className="amen-body" ref={bodyRef}>
          <h2>What this place offers</h2>
          {amenityGroups.map((group) => (
            <div className="amen-group" key={group.title}>
              <h3>{group.title}</h3>
              {group.items.map((item) => (
                <div className={`amen-item${item.struck ? " struck" : ""}`} key={item.label + group.title}>
                  <span className="glyph"><Icon name={`amenFull:${item.label}`} /></span>
                  <span className="label">{item.label}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
