import utahStateFlag from '../assets/utah-state-flag.svg';

function Mark() {
  return <div className="mark" aria-hidden="true"><span></span><span></span><span></span></div>;
}

export function SiteHeader({ activePage = 'Dashboard' }) {
  const navItems = [
    { label: 'Dashboard', href: '/' },
    { label: 'Meetings', href: '/#meetings' },
    { label: 'About', href: '/#about' }
  ];

  return <header className="topbar">
    <div className="brand-lockup">
      <a className="brand" href="/" aria-label="Beehive Brief home"><Mark /><span>Beehive<br /><b>Brief</b></span></a>
      <img className="state-flag" src={utahStateFlag} alt="Utah state flag" />
    </div>
    <nav aria-label="Main navigation">{navItems.map((item) => <a className={activePage === item.label ? 'active' : ''} href={item.href} key={item.label}>{item.label}</a>)}</nav>
    <button className="location" type="button"><span className="pin">⌖</span> Salt Lake County <span className="chevron">⌄</span></button>
  </header>;
}
