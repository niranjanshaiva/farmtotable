import { useRouter } from 'next/router';
import { useState } from 'react';

export default function HomePage() {
  const [farmerEmail, setFarmerEmail] = useState('');
  const [farmerPassword, setFarmerPassword] = useState('');
  const [buyerEmail, setBuyerEmail] = useState('');
  const [buyerPassword, setBuyerPassword] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const router = useRouter();

  const login = async (type: 'farmer' | 'buyer' | 'admin') => {
    if (type === 'admin') {
      if (adminPassword === '1234') {
        sessionStorage.setItem('email', adminEmail);
        router.push('/admin/dashboard');
      } else {
        alert('Invalid Admin Credentials');
      }
      return;
    }

    const email = type === 'farmer' ? farmerEmail : buyerEmail;
    const password = type === 'farmer' ? farmerPassword : buyerPassword;

    if (!email || !password) return alert('Please enter email and password');

    const res = await fetch('/api/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, type }),
    });

    const result = await res.json();
    if (result.success) {
      sessionStorage.setItem('email', email);
      router.push(type === 'farmer' ? '/farmer/dashboard' : '/buyer/products');
    } else {
      alert('Invalid email or password');
    }
  };

  const goToSignup = () => {
    router.push('/signup');
  };

  return (
    <div style={{ backgroundColor: '#e9f5ec', minHeight: '100vh', fontFamily: 'Segoe UI, sans-serif' }}>
      <h1 style={{ textAlign: 'center', padding: '30px 0', color: '#2e7d32', fontWeight: 'bold', fontSize: '32px' }}>
        FARM TO TABLE
      </h1>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '50px', flexWrap: 'wrap' }}>
        {/* Farmer Login */}
        <div style={boxStyle}>
          <h2 style={headerStyle}>Farmer Login</h2>
          <input
            type="email"
            placeholder="Enter Email"
            value={farmerEmail}
            onChange={(e) => setFarmerEmail(e.target.value)}
            style={inputStyle}
          />
          <input
            type="password"
            placeholder="Enter Password"
            value={farmerPassword}
            onChange={(e) => setFarmerPassword(e.target.value)}
            style={inputStyle}
          />
          <button onClick={() => login('farmer')} style={buttonStyle}>Login</button>
          <button onClick={goToSignup} style={linkStyle}>New? Sign up</button>
        </div>

        {/* Buyer Login */}
        <div style={boxStyle}>
          <h2 style={headerStyle}>Buyer Login</h2>
          <input
            type="email"
            placeholder="Enter Email"
            value={buyerEmail}
            onChange={(e) => setBuyerEmail(e.target.value)}
            style={inputStyle}
          />
          <input
            type="password"
            placeholder="Enter Password"
            value={buyerPassword}
            onChange={(e) => setBuyerPassword(e.target.value)}
            style={inputStyle}
          />
          <button onClick={() => login('buyer')} style={buttonStyle}>Login</button>
          <button onClick={goToSignup} style={linkStyle}>New? Sign up</button>
        </div>

        {/* Admin Login */}
        <div style={boxStyle}>
          <h2 style={headerStyle}>Admin Login</h2>
          <input
            type="email"
            placeholder="Enter Admin Email"
            value={adminEmail}
            onChange={(e) => setAdminEmail(e.target.value)}
            style={inputStyle}
          />
          <input
            type="password"
            placeholder="Enter Password"
            value={adminPassword}
            onChange={(e) => setAdminPassword(e.target.value)}
            style={inputStyle}
          />
          <button onClick={() => login('admin')} style={buttonStyle}>Login</button>
        </div>
      </div>
    </div>
  );
}

const boxStyle = {
  background: '#fff',
  borderRadius: '12px',
  padding: '30px',
  width: '280px',
  boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
  textAlign: 'center' as const,
};

const inputStyle = {
  padding: '10px',
  width: '100%',
  marginBottom: '10px',
  borderRadius: '6px',
  border: '1px solid #ccc',
  fontSize: '14px',
};

const buttonStyle = {
  padding: '10px',
  width: '100%',
  backgroundColor: '#43a047',
  color: '#fff',
  border: 'none',
  borderRadius: '6px',
  fontWeight: 'bold' as const,
  fontSize: '14px',
  cursor: 'pointer',
  marginBottom: '8px',
};

const linkStyle = {
  background: 'transparent',
  color: '#388e3c',
  border: 'none',
  cursor: 'pointer',
  fontSize: '13px',
};

const headerStyle = {
  fontWeight: 'bold',
  color: '#2e7d32',
  fontSize: '20px',
  marginBottom: '20px',
};
