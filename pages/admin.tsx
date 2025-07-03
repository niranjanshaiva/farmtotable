// pages/admin.tsx
import { useState } from 'react';
import { useRouter } from 'next/router';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const router = useRouter();

  const login = () => {
    if (email === 'admin@farmtotable.com') {
      sessionStorage.setItem('adminEmail', email);
      router.push('/admin/dashboard');
    } else {
      alert('Access Denied');
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '100px', fontFamily: 'Segoe UI' }}>
      <h1 style={{ fontWeight: 'bold', color: '#2f7d32' }}>Farm to Table Admin</h1>
      <input
        type="email"
        placeholder="Enter Admin Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        style={{ padding: '10px', width: '250px', marginTop: '20px' }}
      />
      <br />
      <button
        onClick={login}
        style={{
          marginTop: '20px',
          padding: '10px 20px',
          backgroundColor: '#2f7d32',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          fontWeight: 'bold'
        }}
      >
        Login
      </button>
    </div>
  );
}
