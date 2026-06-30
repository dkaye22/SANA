import React from 'react'

export default function App() {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#080d1a',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Inter, sans-serif',
      color: '#fff',
    }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: 48, fontWeight: 700, letterSpacing: '-1px', margin: 0 }}>
          Sana
        </h1>
        <p style={{ fontSize: 18, color: '#8899bb', marginTop: 12 }}>
          Your personal wellness guide — coming soon.
        </p>
        <p style={{ fontSize: 13, color: '#3a4a6a', marginTop: 40 }}>
          Scaffold running · Phase 1 complete
        </p>
      </div>
    </div>
  )
}
