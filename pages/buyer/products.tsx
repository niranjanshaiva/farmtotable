import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';

export default function BuyerProducts() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    const buyerEmail = sessionStorage.getItem('email');
    if (!buyerEmail) {
      router.push('/');
    }
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        const updated = data.map(p => ({ ...p, selectedQty: 1 }));
        setProducts(updated);
      });
  }, []);

  const updateQty = (id, qty) => {
    const updated = products.map(p => {
      if (p.id === id) {
        return { ...p, selectedQty: qty };
      }
      return p;
    });
    setProducts(updated);
  };

  const addToCart = (product) => {
    const exists = cart.find(c => c.id === product.id);
    if (exists) {
      alert('Item already in cart');
      return;
    }
    setCart([...cart, product]);
  };

  const removeFromCart = (id) => {
    const updated = cart.filter(c => c.id !== id);
    setCart(updated);
  };

  const getTotal = () => {
    return cart.reduce((sum, item) => sum + item.price * item.selectedQty, 0);
  };

  const getCommission = () => {
    return parseFloat((getTotal() * 0.015).toFixed(2));
  };

  const getFinalAmount = () => {
    return parseFloat((getTotal() + getCommission()).toFixed(2));
  };

  const checkout = () => {
    const baseTotal = getTotal();
    const commission = getCommission();
    const finalAmount = getFinalAmount();

    const options = {
      key: "rzp_test_J3RQxpf2LltUfP",
      amount: finalAmount * 100,
      currency: "INR",
      name: "Farm to Table",
      description: "Buying from farmers",
      prefill: {
        email: sessionStorage.getItem('email') || ''
      },
      theme: {
        color: "#2f855a"
      },
      handler: async function (response) {
        alert("✅ Payment successful!\nPayment ID: " + response.razorpay_payment_id);

        const orderData = {
          buyer: sessionStorage.getItem('email'),
          items: cart,
          total: baseTotal,
          commission: commission,
          paid: finalAmount,
          paymentId: response.razorpay_payment_id
        };

        const res = await fetch('/api/orders/save', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(orderData)
        });

        const result = await res.json();
        alert(result.message);
        setCart([]);
      }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <div style={{ backgroundColor: '#f0fff4', minHeight: '100vh', padding: '20px' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px', color: '#2f855a' }}>🛒 FARM TO TABLE - Buyer Section</h1>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
        <button
          onClick={() => setShowCart(!showCart)}
          style={{ backgroundColor: '#2f855a', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '5px' }}
        >
          View Cart ({cart.length})
        </button>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
        {products.map((p, i) => (
          <div
            key={i}
            style={{ backgroundColor: 'white', padding: '15px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', width: '220px' }}
          >
            {p.image && <img src={p.image} alt={p.name} style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '5px' }} />}
            <h3 style={{ fontWeight: 'bold', fontSize: '18px', color: 'black' }}>{p.name}</h3>
            <p style={{ margin: '5px 0', color: 'black' }}>Price: ₹{p.price}</p>
            <p style={{ color: 'black' }}>Available: {p.quantity}</p>
            <label style={{ display: 'block', marginBottom: '5px' }}>Qty:</label>
            <input
              type="number"
              value={p.selectedQty}
              min="1"
              max={p.quantity}
              onChange={e => updateQty(p.id, parseInt(e.target.value))}
              style={{ width: '60px', marginBottom: '10px' }}
            />
            <br />
            <button
              onClick={() => addToCart(p)}
              style={{ backgroundColor: '#38a169', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '4px', cursor: 'pointer' }}
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>

      {showCart && (
        <div style={{ marginTop: '30px', padding: '20px', backgroundColor: '#f7fafc', borderRadius: '10px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '10px', color: 'black' }}>🛍️ Your Cart</h2>
          {cart.length === 0 && <p style={{ color: 'black' }}>No items in cart.</p>}
          {cart.map((item, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', color: 'black' }}>
              <div>
                <b>{item.name}</b> - ₹{item.price} × {item.selectedQty}
              </div>
              <button
                onClick={() => removeFromCart(item.id)}
                style={{ backgroundColor: 'red', color: 'white', border: 'none', padding: '4px 10px', borderRadius: '4px' }}
              >
                ❌
              </button>
            </div>
          ))}
          <hr />
          <p style={{ fontWeight: 'bold', color: 'black' }}>Subtotal: ₹{getTotal().toFixed(2)}</p>
          <p style={{ fontWeight: 'bold', color: 'black' }}>Commission (1.5%): ₹{getCommission().toFixed(2)}</p>
          <p style={{ fontWeight: 'bold', color: 'black' }}>Total: ₹{getFinalAmount().toFixed(2)}</p>
          <button
            onClick={checkout}
            style={{ marginTop: '10px', backgroundColor: '#2f855a', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' }}
          >
            Proceed to Checkout
          </button>
        </div>
      )}
    </div>
  );
}
