import React from 'react'

function App() {
  console.log('🔍 Debug: Simple App component rendering');
  
  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#1e40af', 
      color: 'white',
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{ fontSize: '2rem', textAlign: 'center', marginBottom: '20px' }}>
        🚀 Simple React App Test
      </h1>
      
      <div style={{ 
        maxWidth: '600px', 
        margin: '0 auto', 
        backgroundColor: 'white', 
        color: 'black',
        padding: '20px',
        borderRadius: '8px'
      }}>
        <h2>✅ If you see this, React is working!</h2>
        <p>This is the simplest possible React app without any external dependencies.</p>
        
        <div style={{ marginTop: '20px' }}>
          <h3>Debug Information:</h3>
          <ul>
            <li>React Version: {React.version}</li>
            <li>Environment: {import.meta.env.MODE}</li>
            <li>Node Environment: {import.meta.env.NODE_ENV}</li>
            <li>Build Time: {new Date().toLocaleString()}</li>
          </ul>
        </div>
        
        <button 
          onClick={() => alert('Button click works!')}
          style={{
            backgroundColor: '#1e40af',
            color: 'white',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginTop: '20px'
          }}
        >
          Test Button Click
        </button>
      </div>
    </div>
  )
}

export default App

