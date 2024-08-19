import '../styles/TopBarstyle.css';

export default function TopBar() {
    return(
        <header className="top-bar">
        <div className="top-bar-content">
          <h1 className="logo">MetaData fetching API</h1>
          <nav className="nav-menu">
            <a href="#" className="nav-link">GitHub Repository</a>
          </nav>
        </div>
      </header>
    );
}
