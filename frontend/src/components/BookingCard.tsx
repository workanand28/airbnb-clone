import { Icon } from "../lib/Icon";
import { listing } from "../data/listing";

export function BookingCard({ onReserve }: { onReserve: () => void }) {
  return (
    <div className="booking-sticky" id="booking">
      <div className="promo">
        <img src="/assets/images/ui/discount.svg" alt="" aria-hidden="true" />
        <div className="text">
          Get 10% off your next stay.
          <br />
          <a href="#">Terms apply</a>
        </div>
        <button className="claim" type="button">Claim</button>
      </div>

      <div className="book-card">
        <div className="book-price">
          <span className="amt">{listing.price}</span>
          <span className="per">{listing.priceNights}</span>
        </div>

        <div className="book-fields">
          <div className="book-dates">
            <button className="book-field" type="button">
              <div className="book-label">CHECK-IN</div>
              <div className="book-value">{listing.checkIn}</div>
            </button>
            <button className="book-field" type="button">
              <div className="book-label">CHECKOUT</div>
              <div className="book-value">{listing.checkOut}</div>
            </button>
          </div>
          <button className="book-guests" type="button">
            <div>
              <div className="book-label">GUESTS</div>
              <div className="book-value">{listing.guests}</div>
            </div>
            <span className="book-chevron glyph"><Icon name="ui:guestChevron" /></span>
          </button>
        </div>

        <div className="book-note">
          Free cancellation before <b>{listing.freeCancelDate}</b>
        </div>

        <button className="btn-reserve full" type="button" onClick={onReserve}>Reserve</button>
        <div className="book-nocharge">You won&apos;t be charged yet</div>
      </div>

      <div className="report">
        <span className="glyph"><Icon name="ui:reportFlag" /></span>
        <a href="#">Report this listing</a>
      </div>
    </div>
  );
}
