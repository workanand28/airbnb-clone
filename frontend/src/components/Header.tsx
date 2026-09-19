import { Icon } from "../lib/Icon";

export function Header() {
  return (
    <header className="site-header" id="site-header">
      <div className="header-inner">
        <a className="logo" href="#" aria-label="Airbnb homepage">
          <span className="logo-mark">
            <Icon name="ui:logo" />
          </span>
        </a>

        <div className="searchbar" role="search">
          <button className="searchbar-btn" type="button">
            <img className="searchbar-house" src="/assets/images/ui/searchbar-house.png" alt="" aria-hidden="true" />
            Anywhere
          </button>
          <span className="searchbar-div" />
          <button className="searchbar-btn" type="button">Anytime</button>
          <span className="searchbar-div" />
          <button className="searchbar-btn muted" type="button">Add guests</button>
          <button className="searchbar-go" aria-label="Search" type="button" />
        </div>

        <nav className="header-nav">
          <a className="host-link" href="#">Become a host</a>
          <button className="icon-btn" aria-label="Choose a language and currency" type="button">
            <span><Icon name="ui:langGlobe" /></span>
          </button>
          <button className="icon-btn" aria-label="Main navigation menu" type="button">
            <span><Icon name="ui:menu" /></span>
          </button>
        </nav>
      </div>
    </header>
  );
}
