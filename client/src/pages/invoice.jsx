import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import "../styles/invoices.css";

const statusConfig = {
  verified: { label: "Verified", icon: "✓" },
  needs_review: { label: "Needs Review", icon: "⚠" },
  rejected: { label: "Rejected", icon: "✕" },
};

const Invoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const { data: sessionData } = await supabase.auth.getSession();
      console.log("Session:", sessionData);
      const { data, error } = await supabase
        .from("invoicetest1")
        .select("*")
        .order("created_at", { ascending: false });
      console.log("Data:", data);
      console.log("Error:", error);
      if (error) throw error;
      setInvoices(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!confirm("Delete this invoice?")) return;
    const { error } = await supabase.from("invoicetest1").delete().eq("id", id);
    if (!error) {
      setInvoices((prev) => prev.filter((inv) => inv.id !== id));
      if (selected?.id === id) setSelected(null);
    }
  };

  const filtered = invoices.filter((inv) => {
    const matchesFilter =
      filter === "all" || inv.verification_status === filter;
    const matchesSearch =
      search === "" ||
      inv.vendor_name?.toLowerCase().includes(search.toLowerCase()) ||
      inv.invoice_number?.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const formatAmount = (val) =>
    val != null
      ? `$${parseFloat(val).toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`
      : "—";

  const counts = {
    all: invoices.length,
    verified: invoices.filter((i) => i.verification_status === "verified")
      .length,
    needs_review: invoices.filter(
      (i) => i.verification_status === "needs_review",
    ).length,
    rejected: invoices.filter((i) => i.verification_status === "rejected")
      .length,
  };

  return (
    <div className="invoices-page">
      {/* Header */}
      <div className="invoices-header">
        <div className="header-left">
          <h1 className="invoices-title">Invoices</h1>
          <p className="invoices-subtitle">
            {invoices.length} invoice{invoices.length !== 1 ? "s" : ""} total
          </p>
        </div>
        <button className="refresh-btn" onClick={fetchInvoices}>
          ↻ Refresh
        </button>
      </div>

      {/* Toolbar */}
      <div className="toolbar">
        <div className="filter-tabs">
          {[
            { key: "all", label: "All" },
            { key: "verified", label: "Verified" },
            { key: "needs_review", label: "Needs Review" },
            { key: "rejected", label: "Rejected" },
          ].map(({ key, label }) => (
            <button
              key={key}
              className={`filter-tab tab-${key} ${filter === key ? "tab-active" : ""}`}
              onClick={() => setFilter(key)}
            >
              {label}
              <span className="tab-count">{counts[key]}</span>
            </button>
          ))}
        </div>
        <div className="search-wrap">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search vendor or invoice #..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      {/* States */}
      {loading ? (
        <div className="state-box">
          <div className="spinner" />
          <p>Loading invoices...</p>
        </div>
      ) : error ? (
        <div className="state-box">
          <p className="state-error">Error: {error}</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="state-box">
          <div className="empty-icon"></div>
          <p>
            {invoices.length === 0
              ? "No invoices yet. Upload one to get started!"
              : "No invoices match your search or filter."}
          </p>
        </div>
      ) : (
        <div className={`content-layout ${selected ? "panel-open" : ""}`}>
          {/* Table */}
          <div className="table-wrap">
            <table className="invoices-table">
              <thead>
                <tr>
                  <th>Invoice #</th>
                  <th>Vendor</th>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((inv, i) => (
                  <tr
                    key={inv.id}
                    className={`invoice-row ${selected?.id === inv.id ? "row-active" : ""}`}
                    onClick={() =>
                      setSelected(selected?.id === inv.id ? null : inv)
                    }
                    style={{ animationDelay: `${i * 25}ms` }}
                  >
                    <td>
                      <span className="mono-text">
                        {inv.invoice_number || "—"}
                      </span>
                    </td>
                    <td>
                      <div className="vendor-cell">
                        <div className="vendor-avatar">
                          {(inv.vendor_name || "?")[0].toUpperCase()}
                        </div>
                        <span className="vendor-name">
                          {inv.vendor_name || "—"}
                        </span>
                      </div>
                    </td>
                    <td className="muted-text">{inv.invoice_date || "—"}</td>
                    <td>
                      <span className="amount-text">
                        {formatAmount(inv.total_amount)}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`status-pill pill-${inv.verification_status}`}
                      >
                        <span className="pill-dot" />
                        {statusConfig[inv.verification_status]?.label ||
                          inv.verification_status ||
                          "—"}
                      </span>
                    </td>
                    <td>
                      <button
                        className="del-btn"
                        onClick={(e) => handleDelete(inv.id, e)}
                        title="Delete"
                      >
                        🗑
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Detail Panel */}
          {selected && (
            <div className="detail-panel">
              <div className="panel-top">
                <div className="panel-avatar">
                  {(selected.vendor_name || "?")[0].toUpperCase()}
                </div>
                <div className="panel-top-info">
                  <h3 className="panel-vendor">
                    {selected.vendor_name || "Unknown Vendor"}
                  </h3>
                  <span className="panel-num">
                    Invoice #{selected.invoice_number || "N/A"}
                  </span>
                </div>
                <button
                  className="panel-close"
                  onClick={() => setSelected(null)}
                >
                  ✕
                </button>
              </div>

              <div
                className={`status-banner banner-${selected.verification_status}`}
              >
                <span>{statusConfig[selected.verification_status]?.icon}</span>
                <span>
                  {statusConfig[selected.verification_status]?.label ||
                    selected.verification_status}
                </span>
              </div>

              <div className="amount-hero">
                <span className="hero-label">Total Amount</span>
                <span className="hero-value">
                  {formatAmount(selected.total_amount)}
                </span>
              </div>

              <div className="detail-rows">
                {[
                  {
                    label: "Invoice Date",
                    value: selected.invoice_date || "—",
                  },
                  { label: "Due Date", value: selected.due_date || "—" },
                  { label: "Subtotal", value: formatAmount(selected.subtotal) },
                  { label: "Tax", value: formatAmount(selected.tax) },
                  { label: "File", value: selected.file_name || "—" },
                  {
                    label: "Uploaded",
                    value: new Date(selected.created_at).toLocaleDateString(
                      "en-US",
                      {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      },
                    ),
                  },
                ].map(({ label, value }) => (
                  <div key={label} className="detail-row">
                    <span className="detail-label">{label}</span>
                    <span className="detail-value">{value}</span>
                  </div>
                ))}
              </div>

              {selected.line_items?.length > 0 && (
                <div className="panel-section">
                  <h4 className="section-heading">Line Items</h4>
                  <div className="line-items">
                    {selected.line_items.map((item, i) => (
                      <div key={i} className="line-item">
                        <div className="li-desc">{item.description}</div>
                        <div className="li-meta">
                          <span className="li-qty">
                            {item.quantity} × {item.unit_price}
                          </span>
                          <span className="li-total">{item.total}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selected.discrepancies?.length > 0 && (
                <div className="panel-section disc-section">
                  <h4 className="section-heading">⚠ Discrepancies</h4>
                  <ul className="disc-list">
                    {selected.discrepancies.map((d, i) => (
                      <li key={i}>{d}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Invoices;
