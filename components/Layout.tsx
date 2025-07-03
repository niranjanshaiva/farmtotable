import React from 'react';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      {/* Green Header */}
      <div style={{
        background: '#4CAF50',
        color: 'white',
        padding: '15px',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: '22px',
        letterSpacing: '1px'
      }}>
        🌿 FARM TO TABLE
      </div>

      {/* Page Content */}
      <main style={{ padding: '20px' }}>
        {children}
      </main>
    </div>
  );
}
