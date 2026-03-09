import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import "../styles/DashboardHome.css";

const DashboardHome = () => {
  const [stats, setStats] = useState({
    total: 0,
    verified: 0,
    needs_review: 0,
    rejected: 0,
  });
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("invoicetest1")
        .select(
          "verification_status, created_at, vendor_name, invoice_number, total_amount",
        )
        .order("created_at", { ascending: false });

      if (error) throw error;

      setStats({
        total: data.length,
        verified: data.filter((i) => i.verification_status === "verified")
          .length,
        needs_review: data.filter(
          (i) => i.verification_status === "needs_review",
        ).length,
        rejected: data.filter((i) => i.verification_status === "rejected")
          .length,
      });
      setRecent(data.slice(0, 5));
    } catch (err) {
      console.error("Error fetching stats:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatAmount = (val) =>
    val != null
      ? `$${parseFloat(val).toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`
      : "—";

  const cards = [
    { key: "total", label: "Total Invoices", icon: "📋" },
    { key: "verified", label: "Verified", icon: "✓" },
    { key: "needs_review", label: "Needs Review", icon: "⚠" },
    { key: "rejected", label: "Rejected", icon: "✕" },
  ];

  const statusConfig = {
    verified: { label: "Verified", pillClass: "pill-verified" },
    needs_review: { label: "Needs Review", pillClass: "pill-review" },
    rejected: { label: "Rejected", pillClass: "pill-rejected" },
  };

  return (
    <div className="dash-home">
      {/* Header */}
      <div className="dash-header">
        <div>
          <h1 className="dash-title">Dashboard</h1>
          <p className="dash-subtitle">
            Overview of your invoice verification activity
          </p>
        </div>
        <button className="dash-refresh" onClick={fetchStats}>
          ↻ Refresh
        </button>
      </div>

      {loading ? (
        <div className="dash-loading">
          <div className="dash-spinner" />
          <p>Loading dashboard...</p>
        </div>
      ) : (
        <>
          {/* Stat Cards */}
          <div className="stat-cards">
            {cards.map((card, i) => (
              <div
                className="stat-card"
                key={card.key}
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className="stat-icon">{card.icon}</div>
                <div className="stat-info">
                  <span className="stat-value">{stats[card.key]}</span>
                  <span className="stat-label">{card.label}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Recent Invoices */}
          <div className="recent-section">
            <h2 className="recent-title">Recent Invoices</h2>
            {recent.length === 0 ? (
              <div className="recent-empty">
                <span>📄</span>
                <p>No invoices yet. Upload one to get started!</p>
              </div>
            ) : (
              <div className="recent-table-wrap">
                <table className="recent-table">
                  <thead>
                    <tr>
                      <th>Invoice #</th>
                      <th>Vendor</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recent.map((inv, i) => (
                      <tr
                        key={i}
                        className="recent-row"
                        style={{ animationDelay: `${i * 40}ms` }}
                      >
                        <td>
                          <span className="recent-mono">
                            {inv.invoice_number || "—"}
                          </span>
                        </td>
                        <td>
                          <div className="recent-vendor">
                            <div className="recent-avatar">
                              {(inv.vendor_name || "?")[0].toUpperCase()}
                            </div>
                            {inv.vendor_name || "—"}
                          </div>
                        </td>
                        <td className="recent-amount">
                          {formatAmount(inv.total_amount)}
                        </td>
                        <td>
                          <span
                            className={`recent-pill ${statusConfig[inv.verification_status]?.pillClass || ""}`}
                          >
                            <span className="pill-dot" />
                            {statusConfig[inv.verification_status]?.label ||
                              inv.verification_status ||
                              "—"}
                          </span>
                        </td>
                        <td className="recent-date">
                          {new Date(inv.created_at).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            },
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default DashboardHome;
