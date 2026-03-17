import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/Login.css'

function AdminLogin() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Identifiants admin (en production : vérifier côté backend)
  const ADMIN_USERS = [
    { username: 'admin', password: 'Admin@2029', role: 'Super Admin', nom: 'Ousmane Ndiaye' },
    { username: 'dge', password: 'DGE@Senegal2029', role: 'Observateur DGE', nom: 'Aminata Diop' },
  ]

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      await new Promise(r => setTimeout(r, 1000))

      const admin = ADMIN_USERS.find(
        a => a.username === username && a.password === password
      )

      if (!admin) {
        setError('Identifiants incorrects. Accès refusé.')
        return
      }

      // Stocker la session admin
      sessionStorage.setItem('adminSession', JSON.stringify({
        nom: admin.nom,
        role: admin.role,
        username: admin.username,
        loginTime: new Date().toISOString()
      }))

      navigate('/admin')

    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="drapeau-bar">
        <div className="drapeau-vert" />
        <div className="drapeau-jaune"><span className="etoile">★</span></div>
        <div className="drapeau-rouge" />
      </div>

      <div className="login-card">
        <div className="login-logo">
          <div className="logo-icon" style={{background:'#1a1a1a'}}>
            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0110 0v4"/>
            </svg>
          </div>
          <div className="logo-texts">
            <span className="logo-text" style={{color:'#1a1a1a'}}>Espace Admin</span>
            <span className="logo-sub">Accès réservé — VoteSecure SN 🇸🇳</span>
          </div>
        </div>

        <div style={{background:'#FDECEA', border:'1px solid #F7C1C1', borderRadius:'6px',
          padding:'10px 14px', fontSize:'13px', color:'#A32D2D', marginBottom:'1.5rem'}}>
          🔒 Zone sécurisée — Toutes les connexions sont enregistrées et auditées
        </div>

        <form onSubmit={handleLogin} noValidate>
          <h1 className="login-title">Connexion administrateur</h1>
          <p className="login-sub">Entrez vos identifiants pour accéder au panneau de contrôle.</p>

          {error && <div className="error-banner">{error}</div>}

          <div className="field">
            <label htmlFor="username">Nom d'utilisateur</label>
            <input
              id="username"
              type="text"
              placeholder="admin"
              value={username}
              onChange={e => { setUsername(e.target.value); setError('') }}
              autoFocus
            />
          </div>

          <div className="field">
            <label htmlFor="password">Mot de passe</label>
            <input
              id="password"
              type="password"
              placeholder="••••••••••"
              value={password}
              onChange={e => { setPassword(e.target.value); setError('') }}
            />
          </div>

          <button type="submit"
            className={`btn-primary ${loading ? 'loading' : ''}`}
            disabled={loading}
            style={{background:'#1a1a1a'}}
          >
            {loading && <span className="spinner" />}
            {loading ? 'Vérification...' : '🔓 Accéder au panneau admin'}
          </button>

          <button type="button" className="btn-ghost"
            onClick={() => navigate('/login')}>
            ← Retour au vote
          </button>
        </form>
      </div>

      <div className="login-footer">
        <span>🔒 Accès réservé aux agents électoraux autorisés</span>
      </div>
    </div>
  )
}

export default AdminLogin