"use client";

import { useState } from "react";
import { Icon } from "../lib/Icon";

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const DOW = ["S", "M", "T", "W", "T", "F", "S"];

// Selected stay: 18–23 Oct 2026. The reference greys out 18–24 and 29–30 of Nov 2026.
const RANGE_START = { y: 2026, m: 9, d: 18 };
const RANGE_END = { y: 2026, m: 9, d: 23 };
const DISABLED_NOV = new Set(["18", "19", "20", "21", "22", "23", "24", "29", "30"]);

function iso(y: number, m: number, d: number) {
  return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

function MonthGrid({ year, month }: { year: number; month: number }) {
  const first = new Date(year, month, 1).getDay();
  const days = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = [...Array(first).fill(null), ...Array.from({ length: days }, (_, i) => i + 1)];

  const startISO = iso(RANGE_START.y, RANGE_START.m, RANGE_START.d);
  const endISO = iso(RANGE_END.y, RANGE_END.m, RANGE_END.d);

  return (
    <div className="cal-month">
      <div className="cal-month-title">{MONTHS[month]} {year}</div>
      <div className="cal-dow">{DOW.map((d, i) => <span key={i}>{d}</span>)}</div>
      <div className="cal-days">
        {cells.map((d, i) => {
          if (d === null) return <div key={i} className="cal-day empty" />;
          const cur = iso(year, month, d);
          const isStart = cur === startISO;
          const isEnd = cur === endISO;
          const inRange = cur > startISO && cur < endISO && year === RANGE_START.y && month === RANGE_START.m;
          const disabled = year === 2026 && month === 10 && DISABLED_NOV.has(String(d));
          const cls = ["cal-day"];
          if (isStart) cls.push("range-start");
          else if (isEnd) cls.push("range-end");
          else if (inRange) cls.push("in-range");
          if (disabled) cls.push("disabled");
          return <div key={i} className={cls.join(" ")}>{d}</div>;
        })}
      </div>
    </div>
  );
}

export function Calendar() {
  // Two-month window; starts on Oct 2026.
  const [offset, setOffset] = useState(0);
  const base = 2026 * 12 + 9 + offset; // Oct 2026
  const y1 = Math.floor(base / 12), m1 = base % 12;
  const y2 = Math.floor((base + 1) / 12), m2 = (base + 1) % 12;

  return (
    <div>
      <div className="cal-head">
        <div className="cal-title">5 nights in Candolim</div>
        <div className="cal-sub">18 Oct 2026 - 23 Oct 2026</div>
      </div>
      <div className="cal-months">
        <div className="cal-nav">
          <button aria-label="Previous month" onClick={() => setOffset((o) => o - 1)}>
            <span className="glyph"><Icon name="ui:calPrev" /></span>
          </button>
          <button aria-label="Next month" onClick={() => setOffset((o) => o + 1)}>
            <span className="glyph"><Icon name="ui:calNext" /></span>
          </button>
        </div>
        <MonthGrid year={y1} month={m1} />
        <MonthGrid year={y2} month={m2} />
      </div>
      <div className="cal-foot">
        <span className="cal-kbd" aria-hidden="true"><Icon name="ui:calKbd" /></span>
        <button className="cal-clear">Clear dates</button>
      </div>
    </div>
  );
}
