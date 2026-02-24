import { useState } from "react";
import Sidebar from "../components/sidebar";
import Topbar from "../components/Topbar";
import "../styles/Dashboard.css";
import Upload from "./upload";

function Dashboard({ setUser }) {
  const [activePage, setActivePage] = useState("Dashboard");

  return (
    <div className="dashboard-page">
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        setUser={setUser}
      />
      <div className="main-area">
        <Topbar />
        <div className="main-content">
          {activePage === "Dashboard" && <p></p>}
          {activePage === "Upload" && <Upload />}
          {activePage === "Invoices" && <p></p>}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
