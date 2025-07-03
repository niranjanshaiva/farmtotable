import { useRouter } from 'next/router';
import { useState } from 'react';

export default function BuyerLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('');

  const login = () => {
    if (!email) {
      alert("Please enter an email");
      return;
    }

    sessionStorage.setItem('email', email);
    router.push('/buyer/products');
  };

  return (
    <div style={{
      backgroundColor: '#f0fff0',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Segoe UI, sans-serif',
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '40px 30px',
        borderRadius: '12px',
        boxShadow: '0 6px 12px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: '400px',
      }}>
        <h2 style={{
          textAlign: 'center',
          fontWeight: 'bold',
          marginBottom: '20px',
          color: '#2E8B57'
        }}>
          🛒 Buyer Login
        </h2>

        <label style={{
          display: 'block',
          marginBottom: '8px',
          fontWeight: 500
        }}>
          Enter Email
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            width: '100%',
            padding: '10px',
            fontSize: '16px',
            border: '1px solid #ccc',
            borderRadius: '6px',
            marginBottom: '20px'
          }}
          placeholder="your@email.com"
        />

        <button
          onClick={login}
          style={{
            width: '100%',
            padding: '12px',
            fontSize: '16px',
            fontWeight: 'bold',
            backgroundColor: '#2E8B57',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          Login
        </button>
      </div>
    </div>
  );
}
