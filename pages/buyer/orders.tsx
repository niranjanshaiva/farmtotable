import { useEffect, useState } from 'react';

export default function BuyerOrders() {
  const [orders, setOrders] = useState([]);
  const [email, setEmail] = useState('');

  useEffect(() => {
    const userEmail = sessionStorage.getItem('email');
    setEmail(userEmail || '');

    fetch('/api/orders')
      .then(res => res.json())
      .then(data => {
        const myOrders = data.filter((o: any) => o.buyer === userEmail);
        setOrders(myOrders);
      });
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h2>🧾 My Orders</h2>
      {orders.length === 0 && <p>No orders found.</p>}
      {orders.map((o, i) => (
        <div key={i} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
          <p><b>Product:</b> {o.productName}</p>
          <p><b>Price:</b> ₹{o.price}</p>
          <p><b>Quantity:</b> {o.quantity}</p>
          <p><b>Total:</b> ₹{(parseFloat(o.price) * parseInt(o.quantity)).toFixed(2)}</p>
          <p><b>Payment ID:</b> {o.paymentId}</p>
        </div>
      ))}
    </div>
  );
}
