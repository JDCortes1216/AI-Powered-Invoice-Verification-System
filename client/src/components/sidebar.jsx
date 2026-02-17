import "../styles/Dashboard.css";
import { supabase } from "../supabaseClient";

function Sidebar({ activePage, setActivePage, setUser }) {
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Logout error:", error.message);
    } else {
      setUser(null);
    }
  };

  return (
    <div className="sidebar">
      <div className="sidebar-top">
        <h2 className="sidebar-title">AI-nvoice</h2>
        <nav className="sidebar-nav">
          <button
            className={activePage === "Dashboard" ? "active" : ""}
            onClick={() => setActivePage("Dashboard")}
          >
            Dashboard
          </button>

          <button
            className={activePage === "Upload" ? "active" : ""}
            onClick={() => setActivePage("Upload")}
          >
            Upload Invoice
          </button>

          <button
            className={activePage === "Invoices" ? "active" : ""}
            onClick={() => setActivePage("Invoices")}
          >
            Invoices
          </button>
        </nav>
      </div>

      <button className="logout-button" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}

export default Sidebar;
