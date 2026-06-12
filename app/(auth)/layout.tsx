export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#1a0a0e',
        fontFamily: 'Georgia, serif',
        color: '#f5f0eb',
        padding: '2rem',
      }}
    >
      <div className="dark" style={{ width: '100%', maxWidth: '400px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🍷</div>
          <h1
            style={{
              fontSize: '1.75rem',
              fontWeight: 'bold',
              color: '#c9a84c',
              letterSpacing: '0.05em',
            }}
          >
            Wine Butler AI
          </h1>
        </div>
        {children}
      </div>
    </main>
  )
}
