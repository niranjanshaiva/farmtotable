// pages/admin/dashboard.tsx
import { useEffect, useState } from 'react';

export default function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [totalSales, setTotalSales] = useState(0);
  const [commission, setCommission] = useState(0);

  useEffect(() => {
    fetch('/api/orders')
      .then(res => res.json())
      .then(data => {
        setOrders(data);

        const total = data.reduce((sum, order) => sum + parseFloat(order.total), 0);
        const commissionAmount = total * 0.015;

        setTotalSales(total);
        setCommission(commissionAmount);
      });
  }, []);

  return (
    <div style={{
      fontFamily: 'Segoe UI, sans-serif',
      backgroundColor: '#f4fff7',
      minHeight: '100vh',
      padding: '30px'
    }}>
      <header style={{
        backgroundColor: '#2e7d32',
        padding: '15px 25px',
        color: '#ffffff',
        borderRadius: '8px',
        marginBottom: '30px',
        fontWeight: 'bold',
        fontSize: '24px',
        letterSpacing: '1px'
      }}>
        🌿 FARM TO TABLE — Admin Dashboard
      </header>

      <div style={{
        backgroundColor: '#ffffff',
        padding: '25px',
        borderRadius: '10px',
        boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ fontWeight: 'bold', color: '#2e7d32', marginBottom: '20px' }}>📊 Sales Overview</h2>
        <p style={{ fontSize: '18px', marginBottom: '10px' }}>
          <strong>Total Sales:</strong> ₹{totalSales.toFixed(2)}
        </p>
        <p style={{ fontSize: '18px', marginBottom: '20px' }}>
          <strong>FarmToTable Commission (1.5%):</strong> ₹{commission.toFixed(2)}
        </p>

        <h3 style={{ fontWeight: '600', color: '#333', marginBottom: '15px' }}>🧾 Orders:</h3>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          border: '1px solid #ddd',
          fontSize: '15px'
        }}>
          <thead>
            <tr style={{ backgroundColor: '#e8f5e9', fontWeight: '600', color: '#000000' }}>
              <th style={cellStyle}>Buyer</th>
              <th style={cellStyle}>Product</th>
              <th style={cellStyle}>Qty</th>
              <th style={cellStyle}>Total (₹)</th>
              <th style={cellStyle}>Payment ID</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o, index) => (
              o.items.map((item, idx) => (
                <tr key={`${index}-${idx}`} style={{ textAlign: 'center' }}>
                  <td style={cellStyle}>{o.buyer}</td>
                  <td style={cellStyle}>{item.name}</td>
                  <td style={cellStyle}>{item.selectedQty}</td>
                  <td style={cellStyle}>{(item.price * item.selectedQty).toFixed(2)}</td>
                  <td style={cellStyle}>{o.paymentId}</td>
                </tr>
              ))
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const cellStyle = {
  border: '1px solid #ccc',
  padding: '10px'
};
