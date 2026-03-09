import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import InvoiceDetails from './InvoiceDetails';

const Invoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  useEffect(() => {
    const fetchInvoices = async () => {
      const { data } = await supabase.from('invoices').select('*');
      if (data) setInvoices(data);
    };
    fetchInvoices();
  }, []);

  const renderStatusBadge = (status) => {
    const stat = status?.toLowerCase() || 'review';
    if (stat === 'valid' || stat === 'verified') {
      return <span style={{ backgroundColor: '#e6f8ec', color: '#26c281', padding: '8px 16px', borderRadius: '20px' }}>Valid</span>;
    }
    if (stat === 'flagged') {
      return <span style={{ backgroundColor: '#e74c3c', color: '#fff', padding: '8px 16px', borderRadius: '20px' }}>Flagged</span>;
    }
    return <span style={{ backgroundColor: '#fef5e7', color: '#f39c12', padding: '8px 16px', borderRadius: '20px' }}>Review</span>;
  };

  const handleDelete = async (id) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this invoice?");
    if (isConfirmed) {
      const { error } = await supabase.from('invoices').delete().eq('id', id);
      if (error) {
        console.error(error);
        alert("Failed to delete the invoice.");
      } else {
        setInvoices(invoices.filter((inv) => inv.id !== id));
      }
    }
  };

  if (selectedInvoice) {
    return (
      <InvoiceDetails 
        invoice={selectedInvoice} 
        onBack={() => setSelectedInvoice(null)}
      />
    );
  }

  return (
    <div style={{ backgroundColor: '#f0f1f4', borderRadius: '20px', padding: '40px', minHeight: '80vh' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '40px', fontSize: '2.5rem', fontWeight: '500', color: '#000' }}>Invoices list</h1>
      
      <div style={{ backgroundColor: '#fff', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', color: '#000' }}>
          <thead>
            <tr style={{ backgroundColor: '#fff', borderBottom: '2px solid #f0f1f4' }}>
              <th style={{ padding: '20px' }}>Invoice</th>
              <th style={{ padding: '20px' }}>Vendor ↕</th>
              <th style={{ padding: '20px' }}>Date ↕</th>
              <th style={{ padding: '20px' }}>Amount ↕</th>
              <th style={{ padding: '20px' }}>Status ↕</th>
              <th style={{ padding: '20px', textAlign: 'center' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((inv, index) => (
              <tr key={inv.id} style={{ backgroundColor: index % 2 === 0 ? '#fcfcfd' : '#fff' }}>
                <td style={{ padding: '20px' }}>#{inv.id.toString().substring(0, 5)}</td>
                <td style={{ padding: '20px' }}>{inv.vendor || `vendor ${index + 1}`}</td>
                <td style={{ padding: '20px' }}>{new Date(inv.created_at).toLocaleDateString()}</td>
                <td style={{ padding: '20px' }}>${inv.amount || '0.00'}</td>
                <td style={{ padding: '20px' }}>{renderStatusBadge(inv.status)}</td>
                <td style={{ padding: '20px', textAlign: 'center', fontSize: '1.2rem', cursor: 'pointer' }}>
                  <span style={{ marginRight: '15px' }} onClick={() => setSelectedInvoice(inv)}>👁️</span>
                  <span style={{ color: '#d9534f' }} onClick={() => handleDelete(inv.id)}>🗑️</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Invoices;