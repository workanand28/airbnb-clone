"use client";

import { useRef, useState } from "react";
import { Icon } from "../lib/Icon";
import { listing } from "../data/listing";
import { BookingCard } from "./BookingCard";
import { Calendar } from "./Calendar";

interface Handlers {
  onOpenTour: () => void;
  onOpenPhoto: (index: number) => void;
  onOpenAmenities: () => void;
  onReserve: () => void;
  onToast: (msg: string) => void;
}

function Stars({ n = 5, size = 10 }: { n?: number; size?: number }) {
  return (
    <span className="stars">
      {Array.from({ length: n }).map((_, i) => (
        <span key={i} style={{ width: size, height: size, display: "inline-block" }}>
          <Icon name="ui:star" />
        </span>
      ))}
    </span>
  );
}

export function ListingContent({ onOpenTour, onOpenPhoto, onOpenAmenities, onReserve, onToast }: Handlers) {
  const [saved, setSaved] = useState(false);
  const [descOpen, setDescOpen] = useState(false);
  const [openReviews, setOpenReviews] = useState<Record<number, boolean>>({});
  const simTrack = useRef<HTMLDivElement>(null);
  const [simPage, setSimPage] = useState(0);

  const scrollSimilar = (dir: 1 | -1) => {
    const el = simTrack.current;
    if (!el) return;
    const amount = el.clientWidth * 0.9 * dir;
    el.scrollBy({ left: amount, behavior: "smooth" });
    setSimPage((p) => Math.max(0, Math.min(1, p + dir)));
  };

  return (
    <main id="main">
      <div className="container">
        {/* Title row */}
        <section id="photos" className="title-row">
          <h1 className="listing-title">{listing.title}</h1>
          <div className="title-actions">
            <button
              className="title-action"
              type="button"
              onClick={() => onToast("Link copied!")}
            >
              <span className="glyph"><Icon name="ui:share" /></span>
              <span className="label">Share</span>
            </button>
            <button
              className={`title-action${saved ? " saved" : ""}`}
              type="button"
              aria-pressed={saved}
              onClick={() => { setSaved((s) => !s); onToast(saved ? "Removed from wishlist" : "Saved to wishlist"); }}
            >
              <span className="glyph"><Icon name={saved ? "ui:save" : "ui:save"} /></span>
              <span className="label">Save</span>
            </button>
          </div>
        </section>

        {/* Hero grid */}
        <section className="hero" aria-label="Photos of this place">
          <div className="hero-grid" id="hero-grid">
            {listing.heroImages.map((img, i) => (
              <button
                key={i}
                className="hero-cell"
                type="button"
                aria-label={`${listing.title} image ${i + 1}`}
                onClick={onOpenTour}
              >
                <img src={img.src} alt="" />
              </button>
            ))}
          </div>
          <button className="show-all-photos" type="button" onClick={onOpenTour}>
            <span className="glyph"><Icon name="ui:lbGrid" /></span>
            Show all photos
          </button>
        </section>

        <div className="content-cols">
          <div className="content-left">
            {/* Overview */}
            <div className="section first">
              <div className="overview">
                <h2>{listing.subtitle}</h2>
                <div className="specs">{listing.specs}</div>
              </div>

              {/* Guest favourite banner */}
              <div className="gf-banner">
                <div className="gf-laurels">
                  <span className="gf-laurel"><LaurelLeft /></span>
                  <span className="gf-laurel-text">Guest<br />favourite</span>
                  <span className="gf-laurel flip"><LaurelRight /></span>
                </div>
                <div className="gf-text">One of the most loved homes on Airbnb, according to guests</div>
                <div className="gf-stats">
                  <div className="gf-stat">
                    <div className="num">{listing.rating}</div>
                    <Stars />
                  </div>
                  <div className="gf-div" />
                  <div className="gf-stat">
                    <div className="num">{listing.reviewCount}</div>
                    <div className="cap">Reviews</div>
                  </div>
                </div>
              </div>

              {/* Host row */}
              <div className="host-row">
                <img src={listing.host.avatar} alt="" />
                <div>
                  <div className="name">Hosted by {listing.host.name}</div>
                  <div className="meta">{listing.host.hosting}</div>
                </div>
              </div>

              {/* Highlights */}
              <div className="highlights">
                {listing.highlights.map((h) => (
                  <div className="highlight" key={h.title}>
                    <span className="glyph"><Icon name={`hi:${h.title}`} /></span>
                    <div>
                      <div className="h-title">{h.title}</div>
                      <div className="h-text">{h.text}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Description */}
              <div className="description">
                <div className="translated">
                  <span>Some info has been automatically translated. <a href="#">Show original</a></span>
                </div>
                <p className={descOpen ? "" : "clamped"}>{listing.description}</p>
                <button className="link-more" onClick={() => setDescOpen((o) => !o)}>
                  {descOpen ? "Show less" : "Show more"}
                  <span className="glyph"><Icon name="ui:descChevron" /></span>
                </button>
              </div>
            </div>

            {/* Where you'll sleep */}
            <div className="section">
              <h2 className="section-title">Where you&apos;ll sleep</h2>
              <div className="sleep-grid">
                {listing.sleep.map((s) => (
                  <div className="sleep-card" key={s.title}>
                    <img src={s.img} alt="" />
                    <div className="title">{s.title}</div>
                    <div className="detail">{s.detail}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Amenities */}
            <div id="amenities" className="section">
              <h2 className="section-title">What this place offers</h2>
              <div className="amenity-grid">
                {listing.amenities.map((a) => (
                  <div className={`amenity${a.struck ? " struck" : ""}`} key={a.label}>
                    <span className="glyph"><Icon name={`amen:${a.icon}`} /></span>
                    <span className="label">{a.label}</span>
                  </div>
                ))}
              </div>
              <button className="btn-outline" type="button" onClick={onOpenAmenities}>Show all 50 amenities</button>
            </div>

            {/* Calendar */}
            <div className="section">
              <Calendar />
            </div>
          </div>

          {/* Right column booking card */}
          <aside className="content-right">
            <BookingCard onReserve={onReserve} />
          </aside>
        </div>
      </div>

      {/* Wide sections */}
      <div className="wide">
        <div className="container">
          {/* Reviews */}
          <section id="reviews" className="wide-section first">
            <div className="reviews-hero">
              <div className="reviews-score">
                <img src="/assets/images/ui/laurel-left.png" alt="" />
                <span className="num">{listing.rating}</span>
                <img src="/assets/images/ui/laurel-right.png" alt="" />
              </div>
              <div className="reviews-fav">Guest favourite</div>
              <div className="reviews-fav-sub">This home is a guest favourite based on ratings, reviews and reliability</div>
              <button className="reviews-how">How reviews work</button>
            </div>

            <div className="ratings-row">
              <div className="rating-col">
                <div className="r-label">Overall rating</div>
                <div className="rating-bars">
                  {listing.overallBars.map((w, i) => (
                    <div className="rating-bar" key={i}>
                      <span className="lvl">{5 - i}</span>
                      <div className="track"><div className="fill" style={{ width: `${w}%` }} /></div>
                    </div>
                  ))}
                </div>
              </div>
              {listing.ratingsBreakdown.map((r) => (
                <div className="rating-col" key={r.label}>
                  <div className="r-label">{r.label}</div>
                  <div className="r-value">{r.value}</div>
                  <span className="glyph"><Icon name={`rev:${r.icon}`} /></span>
                </div>
              ))}
            </div>

            <div className="chips">
              {listing.reviewChips.map((c) => (
                <button className="chip" key={c.label} type="button">
                  <img src={c.img} alt="" aria-hidden="true" />
                  {c.label}
                  <span className="count">{c.count}</span>
                </button>
              ))}
            </div>

            <div className="review-grid">
              {listing.reviews.map((rv, i) => {
                const long = rv.text.length > 170;
                const open = openReviews[i];
                return (
                  <div className="review" key={i}>
                    <div className="head">
                      {rv.avatar ? (
                        <img className="avatar" src={rv.avatar} alt="" />
                      ) : (
                        <div className="avatar-initial" style={{ background: rv.avatarBg }}>{rv.initial}</div>
                      )}
                      <div>
                        <div className="name">{rv.name}</div>
                        <div className="sub">{rv.meta}</div>
                      </div>
                    </div>
                    <div className="rating-line">
                      <Stars size={10} />
                      <span>·</span>
                      <span>{rv.when}</span>
                    </div>
                    <p className={`body${long && !open ? " clamped" : ""}`}>{rv.text}</p>
                    {long && !open && (
                      <button className="more" onClick={() => setOpenReviews((o) => ({ ...o, [i]: true }))}>Show more</button>
                    )}
                  </div>
                );
              })}
            </div>

            <button className="btn-outline" type="button">Show all {listing.reviewCount} reviews</button>
          </section>

          {/* Location */}
          <section id="location" className="wide-section">
            <h2 className="section-title">Where you&apos;ll be</h2>
            <div className="map-caption">{listing.location}</div>
            <div className="map">
              <div className="map-bg" />
              <button className="map-search" aria-label="Search"><span><Icon name="ui:mapSearch" /></span></button>
              <div className="map-zoom">
                <button aria-label="Zoom in"><span className="glyph"><Icon name="ui:zoomIn" /></span></button>
                <button aria-label="Zoom out"><span className="glyph"><Icon name="ui:zoomOut" /></span></button>
              </div>
              <div className="map-pin"><Icon name="ui:mapPin" /></div>
            </div>
            <div className="map-note">Exact location will be provided after booking.</div>
            <div className="nb-title">Neighbourhood highlights</div>
            <div className="nb-text">{listing.neighbourhood}</div>
            <button className="link-more">Show more<span className="glyph"><Icon name="ui:descChevron" /></span></button>
          </section>

          {/* Meet your host */}
          <section className="wide-section">
            <h2 className="section-title">Meet your host</h2>
            <div className="host-cols">
              <div>
                <div className="host-card">
                  <div className="who">
                    <div className="host-avatar">
                      <img src={listing.host.avatar} alt="" />
                      <span className="host-verified"><Icon name="ui:verifiedBadge" /></span>
                    </div>
                    <div className="host-name">{listing.host.name}</div>
                    <div className="host-role">Host</div>
                  </div>
                  <div className="host-stats">
                    <div className="host-stat"><div className="num">{listing.host.reviews}</div><div className="cap">Reviews</div></div>
                    <div className="host-stat"><div className="num">{listing.host.hostRating}★</div><div className="cap">Rating</div></div>
                    <div className="host-stat"><div className="num">{listing.host.years}</div><div className="cap">Years hosting</div></div>
                  </div>
                </div>
                <div className="host-facts">
                  {listing.host.facts.map((f, i) => (
                    <div className="host-fact" key={i}>
                      <span className="glyph"><Icon name={`hostdet:${i}`} /></span>
                      {f}
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <div className="cohost-title">Co-Hosts</div>
                <div className="cohosts">
                  {listing.coHosts.map((c) => (
                    <div className="cohost" key={c.name}>
                      {c.avatar ? <img src={c.avatar} alt="" /> : <span className="initial" style={{ background: c.avatarBg }}>{c.initial}</span>}
                      <span>{c.name}</span>
                    </div>
                  ))}
                </div>
                <div className="host-details-title">Host details</div>
                <div className="host-detail-text">{listing.host.responseRate}<br />{listing.host.responseTime}</div>
                <button className="btn-message">Message host</button>
                <div className="host-protect">
                  <span className="glyph"><Icon name="ui:safety" /></span>
                  <span>To help protect your payment, always use Airbnb to send money and communicate with hosts.</span>
                </div>
              </div>
            </div>
          </section>

          {/* Things to know */}
          <section className="wide-section">
            <h2 className="section-title">Things to know</h2>
            <div className="ttk-grid">
              {listing.thingsToKnow.map((t) => (
                <div className="ttk" key={t.title}>
                  <span className="glyph"><Icon name={`ttk:${t.title}`} /></span>
                  <div className="t-title">{t.title}</div>
                  {t.lines.map((l, i) => <p key={i}>{l}</p>)}
                  <a className="t-more" href="#">Learn more</a>
                </div>
              ))}
            </div>
          </section>

          {/* More stays nearby */}
          <section className="wide-section">
            <div className="similar-head">
              <h2 className="section-title" style={{ marginBottom: 0 }}>More stays nearby</h2>
              <div className="similar-nav">
                <span className="similar-count">{simPage + 1} / 2</span>
                <button className="similar-arrow" aria-label="Previous" disabled={simPage === 0} onClick={() => scrollSimilar(-1)}>
                  <span className="glyph"><Icon name="ui:simPrev" /></span>
                </button>
                <button className="similar-arrow" aria-label="Next" disabled={simPage === 1} onClick={() => scrollSimilar(1)}>
                  <span className="glyph"><Icon name="ui:simNext" /></span>
                </button>
              </div>
            </div>
            <div className="similar-track" ref={simTrack}>
              {listing.similar.map((s, i) => (
                <div className="similar-card" key={i}>
                  <img src={s.img} alt="" />
                  <div className="title">{s.title}</div>
                  <div className="price">
                    {s.price} <span className="star"><Icon name="ui:star" /></span> {s.rating}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

function LaurelLeft() {
  return (
    <svg style={{ display: "block", height: "100%", width: "auto" }} viewBox="0 0 20 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path fillRule="evenodd" clipRule="evenodd" d="M15.4895 25.417L14.8276 24.4547L16.5303 23.6492L17.1923 24.6116L16.3409 25.0143L17.1923 24.6116C18.6638 26.751 17.9509 29.3868 15.5999 30.4989C14.8548 30.8513 14.0005 31.0196 13.1221 30.987L12.8044 30.9752L12.7297 29.2305L13.0474 29.2423C13.5744 29.2618 14.0871 29.1608 14.5341 28.9494C15.9447 28.2821 16.3725 26.7007 15.4895 25.417Z" fill="#222222" />
      <path fillRule="evenodd" clipRule="evenodd" d="M8.32441 10.235C10.0819 8.96204 10.9247 7.4878 10.853 5.81232C10.7813 4.13685 9.80929 2.59524 7.93708 1.18749C6.17964 2.46049 5.33678 3.93473 5.40851 5.6102C5.48024 7.28568 6.45221 8.82729 8.32441 10.235Z" fill="#F7F7F7" />
      <path fillRule="evenodd" clipRule="evenodd" d="M7.19425 0.489275C7.55718 0.226387 8.10753 0.246818 8.49416 0.537533C10.5385 2.07473 11.7071 3.84975 11.7923 5.84026C11.8775 7.83076 10.8574 9.52453 8.93841 10.9146C8.57548 11.1775 8.02513 11.157 7.6385 10.8663C5.59415 9.32914 4.4256 7.55411 4.34039 5.56361C4.25517 3.57311 5.27521 1.87933 7.19425 0.489275ZM7.92362 2.3684C6.77985 3.38355 6.29788 4.47199 6.3478 5.63813C6.39772 6.80428 6.97457 7.93203 8.20904 9.03547C9.35281 8.02032 9.83478 6.93187 9.78486 5.76573C9.73493 4.59959 9.15809 3.47184 7.92362 2.3684Z" fill="#222222" />
      <path fillRule="evenodd" clipRule="evenodd" d="M15.6806 24.0529C14.1314 22.353 12.4326 21.4688 10.5842 21.4001C8.73575 21.3315 7.10737 22.0923 5.69905 23.6824C7.24822 25.3823 8.94702 26.2666 10.7955 26.3352C12.6439 26.4038 14.2723 25.6431 15.6806 24.0529Z" fill="#F7F7F7" />
      <path fillRule="evenodd" clipRule="evenodd" d="M4.90529 24.1787C4.60807 23.8526 4.58911 23.4097 4.8593 23.1046C6.38985 21.3765 8.27538 20.4331 10.521 20.5164C12.7666 20.5998 14.7391 21.6864 16.4227 23.5339C16.7199 23.86 16.7389 24.303 16.4687 24.608C14.9381 26.3361 13.0526 27.2795 10.807 27.1962C8.56134 27.1128 6.5889 26.0262 4.90529 24.1787ZM6.98781 23.7198C8.22307 24.8808 9.46778 25.4045 10.7323 25.4515C11.9968 25.4984 13.2005 25.0656 14.3402 23.9928C13.1049 22.8318 11.8602 22.3081 10.5957 22.2611C9.3312 22.2142 8.12744 22.6471 6.98781 23.7198Z" fill="#222222" />
      <path fillRule="evenodd" clipRule="evenodd" d="M10.6766 20.7043C10.2137 18.5957 9.16392 17.0928 7.52727 16.1956C5.89062 15.2984 3.99442 15.1864 1.83867 15.8596C2.30157 17.9683 3.35135 19.4712 4.988 20.3684C6.62465 21.2656 8.52085 21.3775 10.6766 20.7043Z" fill="#F7F7F7" />
      <path fillRule="evenodd" clipRule="evenodd" d="M0.791956 15.9443C0.703053 15.5393 0.94431 15.1569 1.37329 15.023C3.7337 14.2859 5.9714 14.3695 7.95247 15.4554C9.92449 16.5364 11.1013 18.3139 11.6022 20.5956C11.6911 21.0006 11.4499 21.3829 11.0209 21.5169C8.66048 22.254 6.42277 22.1704 4.4417 21.0844C2.46969 20.0034 1.29285 18.226 0.791956 15.9443ZM2.95349 16.4656C3.43375 17.9951 4.27991 19.007 5.41321 19.6282C6.5306 20.2407 7.84423 20.4286 9.44069 20.0743C8.96043 18.5448 8.11427 17.5329 6.98097 16.9116C5.86358 16.2991 4.54995 16.1113 2.95349 16.4656Z" fill="#222222" />
      <path fillRule="evenodd" clipRule="evenodd" d="M7.90911 15.6267C8.65652 13.6743 8.53705 11.9555 7.55072 10.4702C6.56438 8.98484 4.90844 8.03014 2.58291 7.60605C1.8355 9.55846 1.95497 11.2773 2.9413 12.7626C3.92764 14.2479 5.58357 15.2026 7.90911 15.6267Z" fill="#F7F7F7" />
      <path fillRule="evenodd" clipRule="evenodd" d="M1.66037 7.28295C1.80927 6.89397 2.26578 6.67525 2.74598 6.76282C5.29848 7.22831 7.26368 8.31371 8.44396 10.0911C9.61955 11.8614 9.70866 13.854 8.89805 15.9715C8.74915 16.3605 8.29264 16.5792 7.81244 16.4916C5.25994 16.0261 3.29474 14.9407 2.11446 13.1634C0.938866 11.393 0.849755 9.40048 1.66037 7.28295ZM3.3385 8.6613C2.94038 10.1267 3.14588 11.3465 3.83454 12.3835C4.51397 13.4067 5.60091 14.1584 7.21992 14.5931C7.61804 13.1278 7.41254 11.9079 6.72388 10.8709C6.04445 9.84774 4.95751 9.09607 3.3385 8.6613Z" fill="#222222" />
    </svg>
  );
}

function LaurelRight() {
  return (
    <svg style={{ display: "block", height: "100%", width: "auto" }} viewBox="0 0 20 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path fillRule="evenodd" clipRule="evenodd" d="M15.4895 25.417L14.8276 24.4547L16.5303 23.6492L17.1923 24.6116L16.3409 25.0143L17.1923 24.6116C18.6638 26.751 17.9509 29.3868 15.5999 30.4989C14.8548 30.8513 14.0005 31.0196 13.1221 30.987L12.8044 30.9752L12.7297 29.2305L13.0474 29.2423C13.5744 29.2618 14.0871 29.1608 14.5341 28.9494C15.9447 28.2821 16.3725 26.7007 15.4895 25.417Z" fill="#222222" />
      <path fillRule="evenodd" clipRule="evenodd" d="M8.32441 10.235C10.0819 8.96204 10.9247 7.4878 10.853 5.81232C10.7813 4.13685 9.80929 2.59524 7.93708 1.18749C6.17964 2.46049 5.33678 3.93473 5.40851 5.6102C5.48024 7.28568 6.45221 8.82729 8.32441 10.235Z" fill="#F7F7F7" />
      <path fillRule="evenodd" clipRule="evenodd" d="M7.19425 0.489275C7.55718 0.226387 8.10753 0.246818 8.49416 0.537533C10.5385 2.07473 11.7071 3.84975 11.7923 5.84026C11.8775 7.83076 10.8574 9.52453 8.93841 10.9146C8.57548 11.1775 8.02513 11.157 7.6385 10.8663C5.59415 9.32914 4.4256 7.55411 4.34039 5.56361C4.25517 3.57311 5.27521 1.87933 7.19425 0.489275ZM7.92362 2.3684C6.77985 3.38355 6.29788 4.47199 6.3478 5.63813C6.39772 6.80428 6.97457 7.93203 8.20904 9.03547C9.35281 8.02032 9.83478 6.93187 9.78486 5.76573C9.73493 4.59959 9.15809 3.47184 7.92362 2.3684Z" fill="#222222" />
      <path fillRule="evenodd" clipRule="evenodd" d="M15.6806 24.0529C14.1314 22.353 12.4326 21.4688 10.5842 21.4001C8.73575 21.3315 7.10737 22.0923 5.69905 23.6824C7.24822 25.3823 8.94702 26.2666 10.7955 26.3352C12.6439 26.4038 14.2723 25.6431 15.6806 24.0529Z" fill="#F7F7F7" />
      <path fillRule="evenodd" clipRule="evenodd" d="M4.90529 24.1787C4.60807 23.8526 4.58911 23.4097 4.8593 23.1046C6.38985 21.3765 8.27538 20.4331 10.521 20.5164C12.7666 20.5998 14.7391 21.6864 16.4227 23.5339C16.7199 23.86 16.7389 24.303 16.4687 24.608C14.9381 26.3361 13.0526 27.2795 10.807 27.1962C8.56134 27.1128 6.5889 26.0262 4.90529 24.1787ZM6.98781 23.7198C8.22307 24.8808 9.46778 25.4045 10.7323 25.4515C11.9968 25.4984 13.2005 25.0656 14.3402 23.9928C13.1049 22.8318 11.8602 22.3081 10.5957 22.2611C9.3312 22.2142 8.12744 22.6471 6.98781 23.7198Z" fill="#222222" />
      <path fillRule="evenodd" clipRule="evenodd" d="M10.6766 20.7043C10.2137 18.5957 9.16392 17.0928 7.52727 16.1956C5.89062 15.2984 3.99442 15.1864 1.83867 15.8596C2.30157 17.9683 3.35135 19.4712 4.988 20.3684C6.62465 21.2656 8.52085 21.3775 10.6766 20.7043Z" fill="#F7F7F7" />
      <path fillRule="evenodd" clipRule="evenodd" d="M0.791956 15.9443C0.703053 15.5393 0.94431 15.1569 1.37329 15.023C3.7337 14.2859 5.9714 14.3695 7.95247 15.4554C9.92449 16.5364 11.1013 18.3139 11.6022 20.5956C11.6911 21.0006 11.4499 21.3829 11.0209 21.5169C8.66048 22.254 6.42277 22.1704 4.4417 21.0844C2.46969 20.0034 1.29285 18.226 0.791956 15.9443ZM2.95349 16.4656C3.43375 17.9951 4.27991 19.007 5.41321 19.6282C6.5306 20.2407 7.84423 20.4286 9.44069 20.0743C8.96043 18.5448 8.11427 17.5329 6.98097 16.9116C5.86358 16.2991 4.54995 16.1113 2.95349 16.4656Z" fill="#222222" />
      <path fillRule="evenodd" clipRule="evenodd" d="M7.90911 15.6267C8.65652 13.6743 8.53705 11.9555 7.55072 10.4702C6.56438 8.98484 4.90844 8.03014 2.58291 7.60605C1.8355 9.55846 1.95497 11.2773 2.9413 12.7626C3.92764 14.2479 5.58357 15.2026 7.90911 15.6267Z" fill="#F7F7F7" />
      <path fillRule="evenodd" clipRule="evenodd" d="M1.66037 7.28295C1.80927 6.89397 2.26578 6.67525 2.74598 6.76282C5.29848 7.22831 7.26368 8.31371 8.44396 10.0911C9.61955 11.8614 9.70866 13.854 8.89805 15.9715C8.74915 16.3605 8.29264 16.5792 7.81244 16.4916C5.25994 16.0261 3.29474 14.9407 2.11446 13.1634C0.938866 11.393 0.849755 9.40048 1.66037 7.28295ZM3.3385 8.6613C2.94038 10.1267 3.14588 11.3465 3.83454 12.3835C4.51397 13.4067 5.60091 14.1584 7.21992 14.5931C7.61804 13.1278 7.41254 11.9079 6.72388 10.8709C6.04445 9.84774 4.95751 9.09607 3.3385 8.6613Z" fill="#222222" />
    </svg>
  );
}
