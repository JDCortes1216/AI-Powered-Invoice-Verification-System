import { useState, useEffect } from "react";
import Sidebar from "../components/sidebar";
import Topbar from "../components/Topbar";
import "../styles/Dashboard.css";
import Upload from "./upload";
import Invoices from "./Invoices";
import { supabase } from "../supabaseClient";

function Dashboard({ setUser }) {
  const [activePage, setActivePage] = useState("Dashboard");
  
  const [recentInvoices, setRecentInvoices] = useState([]);
  const [stats, setStats] = useState({ total: 0, valid: 0, flagged: 0, review: 0 });

  useEffect(() => {
    if (activePage !== "Dashboard") return;

    const fetchDashboardData = async () => {
      const { data: allData } = await supabase.from('invoices').select('*');
      if (allData) {
        setStats({
          total: allData.length,
          valid: allData.filter(i => i.status?.toLowerCase() === 'valid' || i.status?.toLowerCase() === 'verified').length,
          flagged: allData.filter(i => i.status?.toLowerCase() === 'flagged').length,
          review: allData.filter(i => i.status?.toLowerCase() === 'review' || i.status?.toLowerCase() === 'for review' || !i.status).length
        });
      }

      const { data: recentData } = await supabase
        .from('invoices')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      if (recentData) setRecentInvoices(recentData);
    };
    fetchDashboardData();
  }, [activePage]);

  const Card = ({ title, count, bgColor }) => (
    <div style={{ backgroundColor: bgColor, borderRadius: '30px', padding: '20px 30px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flex: 1, boxShadow: '0 4px 6px rgba(0,0,0,0.05)', minWidth: '200px', color: '#000' }}>
      <span style={{ fontSize: '1.1rem', fontWeight: '500', maxWidth: '80px', lineHeight: '1.2' }}>{title}</span>
      <span style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>{count}</span>
    </div>
  );

  return (
    <div className="dashboard-page" style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f5f6fa', margin: 0 }}>
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        setUser={setUser}
      />
      <div className="main-area" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Topbar />
        
        <div className="main-content" style={{ padding: '40px' }}>
          
          {activePage === "Dashboard" && (
            <div>
              <div style={{ backgroundColor: '#f0f1f4', borderRadius: '20px', padding: '40px', marginBottom: '40px' }}>
                <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                  <Card title="Total Invoices" count={stats.total} bgColor="#ea00d9" />
                  <Card title="Total valid Invoices" count={stats.valid} bgColor="#26c281" />
                  <Card title="Total flagged Invoices" count={stats.flagged} bgColor="#e74c3c" />
                  <Card title="For review" count={stats.review} bgColor="#f39c12" />
                </div>
              </div>
              <h3 style={{ marginBottom: '20px', fontWeight: 'normal', color: '#000' }}>Recent invoices</h3>
              <div style={{ backgroundColor: '#fff', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', color: '#000' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#fff', borderBottom: '2px solid #f0f1f4' }}>
                      <th style={{ padding: '20px' }}>Invoice</th>
                      <th style={{ padding: '20px' }}>Vendor ↕</th>
                      <th style={{ padding: '20px' }}>Date ↕</th>
                      <th style={{ padding: '20px' }}>Amount ↕</th>
                      <th style={{ padding: '20px' }}>Status ↕</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentInvoices.map((inv, index) => (
                      <tr key={inv.id} style={{ backgroundColor: index % 2 === 0 ? '#fcfcfd' : '#fff' }}>
                        <td style={{ padding: '20px' }}>#{inv.id.toString().substring(0, 5)}</td>
                        <td style={{ padding: '20px' }}>{inv.vendor || 'vendor 1'}</td>
                        <td style={{ padding: '20px' }}>{new Date(inv.created_at).toLocaleDateString()}</td>
                        <td style={{ padding: '20px' }}>${inv.amount || '0.00'}</td>
                        <td style={{ padding: '20px' }}>
                          <span style={{ backgroundColor: '#e6f8ec', color: '#26c281', padding: '8px 16px', borderRadius: '20px', fontSize: '0.9rem' }}>Valid</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activePage === "Upload" && <Upload />}
          {activePage === "Invoices" && <Invoices />}

        </div>
      </div>
    </div>
  );
}

export default Dashboard;