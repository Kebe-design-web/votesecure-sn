import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import OtpInput from '../components/OtpInput'
import '../styles/Login.css'
import API_URL from '../config'

function Login() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [cnie, setCnie] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [globalError, setGlobalError] = useState('')
  const [otp, setOtp] = useState('')
  const [timer, setTimer] = useState(300)
  const [timerActive, setTimerActive] = useState(false)
  const [otpLoading, setOtpLoading] = useState(false)
  const [otpError, setOtpError] = useState('')
  const [electeurId, setElecteurId] = useState(null)
  const [otpDebug, setOtpDebug] = useState('')

  useEffect(() => {
    if (!timerActive || timer === 0) return
    const interval = setInterval(() => {
      setTimer(prev => (prev <= 1 ? 0 : prev - 1))
    }, 1000)
    return () => clearInterval(interval)
  }, [timerActive, timer])

  const formatTimer = (s) => {
    const m = Math.floor(s / 60).toString().padStart(2, '0')
    const sec = (s % 60).toString().padStart(2, '0')
    return `${m}:${sec}`
  }

  const handleCnieChange = (e) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 13)
    const fmt = raw.replace(/(\d{1})(\d{0,3})(\d{0,3})(\d{0,3})(\d{0,2})/, (_, a, b, c, d, e) =>
      [a, b, c, d, e].filter(Boolean).join(' '))
    setCnie(fmt)
    if (errors.cnie) setErrors(p => ({ ...p, cnie: '' }))
    setGlobalError('')
  }

  const validateStep1 = () => {
    const errs = {}
    const clean = cnie.replace(/\s/g, '')
    if (!clean) errs.cnie = 'Le numéro CNIE est obligatoire'
    else if (!/^\d{13}$/.test(clean)) errs.cnie = 'Le CNIE doit contenir 13 chiffres'
    if (!password) errs.password = 'Le mot de passe est obligatoire'
    else if (password.length < 6) errs.password = 'Minimum 6 caractères'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmitStep1 = async (e) => {
    e.preventDefault()
    if (!validateStep1()) return
    setLoading(true)
    setGlobalError('')
    try {
      const response = await fetch(`${API_URL}/api/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cnie: cnie.replace(/\s/g, ''), password })
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message)
      setElecteurId(data.electeurId)
      setOtpDebug(data.otpDebug)
      setStep(2)
      setTimer(300)
      setTimerActive(true)
    } catch (err) {
      setGlobalError(err.message || 'CNIE ou mot de passe incorrect.')
    } finally {
      setLoading(false)
    }
  }

  const handleResendOtp = async () => {
    if (timer > 0) return
    setOtp('')
    setTimer(300)
    setTimerActive(true)
    setOtpError('')
  }

  const handleSubmitStep2 = async (e) => {
    e.preventDefault()
    if (otp.length < 6) { setOtpError('Entrez les 6 chiffres du code'); return }
    if (timer === 0) { setOtpError('Le code a expiré. Demandez un nouveau.'); return }
    setOtpLoading(true)
    setOtpError('')
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ electeurId, otp })
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message)
      localStorage.setItem('token', data.token)
      localStorage.setItem('electeur', JSON.stringify(data.electeur))
      navigate('/vote')
    } catch (err) {
      setOtpError(err.message || 'Code incorrect ou expiré.')
      setOtp('')
    } finally {
      setOtpLoading(false)
    }
  }

  const handleBack = () => {
    setStep(1)
    setOtp('')
    setOtpError('')
    setTimerActive(false)
  }

  return (
    <div className="login-page">
      <div className="drapeau-bar">
        <div className="drapeau-vert" />
        <div className="drapeau-jaune">
          <span className="etoile">★</span>
        </div>
        <div className="drapeau-rouge" />
      </div>

      <div className="login-card">
        <div className="login-logo">
          <div className="logo-icon">
            <svg viewBox="0 0 40 40" width="40" height="40">
              <circle cx="20" cy="20" r="20" fill="#00853F"/>
              <circle cx="20" cy="18" r="10" fill="#D4AF37"/>
              <circle cx="20" cy="19" r="7" fill="#C8860A"/>
              <circle cx="17" cy="17" r="1.5" fill="#1a1a1a"/>
              <circle cx="23" cy="17" r="1.5" fill="#1a1a1a"/>
              <ellipse cx="20" cy="20" rx="2" ry="1.5" fill="#8B4513"/>
              <path d="M17 22 Q20 24 23 22" fill="none" stroke="#8B4513" strokeWidth="1"/>
              <line x1="12" y1="20" x2="18" y2="20" stroke="#D4AF37" strokeWidth="0.8"/>
              <line x1="22" y1="20" x2="28" y2="20" stroke="#D4AF37" strokeWidth="0.8"/>
              <rect x="18" y="28" width="4" height="5" fill="#8B4513"/>
              <ellipse cx="20" cy="28" rx="6" ry="3" fill="#00853F"/>
            </svg>
          </div>
          <div className="logo-texts">
            <span className="logo-text">VoteSecure</span>
            <span className="logo-sub">République du Sénégal 🇸🇳</span>
          </div>
        </div>

        <div className="steps">
          <div className="step">
            <div className={`step-dot ${step >= 1 ? 'done' : ''}`}>
              {step > 1 ? '✓' : '1'}
            </div>
            <span className={`step-label ${step === 1 ? 'active' : ''}`}>Identité</span>
          </div>
          <div className={`step-line ${step > 1 ? 'done' : ''}`} />
          <div className="step">
            <div className={`step-dot ${step === 2 ? 'active' : ''}`}>2</div>
            <span className={`step-label ${step === 2 ? 'active' : ''}`}>Vérification OTP</span>
          </div>
        </div>

        {step === 1 && (
          <form onSubmit={handleSubmitStep1} noValidate>
            <h1 className="login-title">Connexion</h1>
            <p className="login-sub">
              Entrez votre numéro de carte d'identité nationale pour accéder au vote.
            </p>
            {globalError && <div className="error-banner">{globalError}</div>}
            <div className="field">
              <label htmlFor="cnie">Numéro CNIE</label>
              <input
                id="cnie"
                type="text"
                inputMode="numeric"
                placeholder="1 234 567 890 123"
                value={cnie}
                onChange={handleCnieChange}
                className={errors.cnie ? 'error' : ''}
                autoFocus
              />
              {errors.cnie && <p className="field-error">{errors.cnie}</p>}
            </div>
            <div className="field">
              <label htmlFor="password">Mot de passe</label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => {
                  setPassword(e.target.value)
                  if (errors.password) setErrors(p => ({ ...p, password: '' }))
                }}
                className={errors.password ? 'error' : ''}
              />
              {errors.password && <p className="field-error">{errors.password}</p>}
            </div>
            <div className="info-box">
              🔒 Votre CNIE est chiffrée en transit. Elle n'est jamais stockée en clair.
            </div>
            <button type="submit" className={`btn-primary ${loading ? 'loading' : ''}`} disabled={loading}>
              {loading && <span className="spinner" />}
              {loading ? 'Vérification...' : 'Continuer →'}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleSubmitStep2} noValidate>
            <h1 className="login-title">Vérification OTP</h1>
            <p className="login-sub">
              Code envoyé au <strong>+221 77 *** **34</strong>.<br />
              Entrez les 6 chiffres reçus par SMS.
            </p>

            {/* Code OTP visible en développement */}
            {otpDebug && (
              <div className="info-box" style={{marginBottom:'1rem'}}>
                🔧 Mode dev — Votre code OTP : <strong>{otpDebug}</strong>
              </div>
            )}

            {otpError && <div className="error-banner">{otpError}</div>}
            <OtpInput value={otp} onChange={setOtp} length={6} />
            <div className="otp-meta">
              <p className={`otp-timer ${timer === 0 ? 'expired' : ''}`}>
                {timer > 0
                  ? <>Expire dans <span>{formatTimer(timer)}</span></>
                  : <span>Code expiré</span>}
              </p>
              <button type="button" className="btn-resend"
                onClick={handleResendOtp} disabled={timer > 0}>
                Renvoyer le code
              </button>
            </div>
            <button type="submit"
              className={`btn-primary ${otpLoading ? 'loading' : ''}`}
              disabled={otpLoading || otp.length < 6}>
              {otpLoading && <span className="spinner" />}
              {otpLoading ? 'Vérification...' : 'Valider le code →'}
            </button>
            <button type="button" className="btn-ghost" onClick={handleBack}>
              ← Retour
            </button>
          </form>
        )}
      </div>

      <div className="login-footer">
        <span>🌳 Un vote, une voix — Sénégal 2029</span>
      </div>
    </div>
  )
}

export default Login