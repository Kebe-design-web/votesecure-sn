import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/Vote.css'

const langues = {
  fr: {
    label: '🇫🇷 Français', code: 'fr-FR',
    titre: 'Élection Présidentielle 2029',
    clotureTexte: 'Clôture dans', candidatsTexte: '7 candidats',
    confirmerBtn: 'Confirmer mon vote →',
    securiteMsg: '🔒 Vote chiffré RSA-2048 avant envoi.',
    accessibleMsg: '🔊 Cliquez sur 🔊 pour entendre le nom du candidat',
    confirmerTitre: 'Confirmer votre vote', confirmerSub: 'Cette action est irréversible',
    voterBtn: 'Voter maintenant →', annulerBtn: 'Annuler',
    selectionLabel: 'Votre sélection',
    voteOk: 'Vote enregistré !', voteSub: 'Votre vote a été chiffré et soumis avec succès',
    merci: '🌳 Merci d\'avoir participé à la démocratie sénégalaise 🇸🇳',
    doubleVote: '🚫 Vous avez déjà voté. Il est impossible de voter une deuxième fois.',
    candidats: [
      { description: 'Candidat numéro un : Amadou Koné' },
      { description: 'Candidat numéro deux : Fatou Diallo' },
      { description: 'Candidat numéro trois : Moussa Sarr' },
      { description: 'Candidat numéro quatre : Ousmane Balde' },
      { description: 'Candidat numéro cinq : Aissatou Ndiaye' },
      { description: 'Candidat numéro six : Mamadou Ba' },
      { description: 'Candidat numéro sept : Rokhaya Sy' },
    ]
  },
  wo: {
    label: '🇸🇳 Wolof', code: 'fr-FR',
    titre: 'Vot bu President 2029',
    clotureTexte: 'Dëkk ci', candidatsTexte: '7 yi',
    confirmerBtn: 'Tann sa candidat →',
    securiteMsg: '🔒 Sa vot daña ko seetël ci ordinatëër.',
    accessibleMsg: '🔊 Toppi ci 🔊 ngir dégg tur wu candidat',
    confirmerTitre: 'Xam-xam sa vot', confirmerSub: 'Bul dem ci kanam',
    voterBtn: 'Vot léegi →', annulerBtn: 'Sukkandiku',
    selectionLabel: 'Sa tann',
    voteOk: 'Sa vot dafa enregistré!', voteSub: 'Sa vot dafa seetël te yonnëënt nanga ko',
    merci: '🌳 Jërejëf ! Sénégal 🇸🇳',
    doubleVote: '🚫 Vot ngeen déjà. Dinga mën woon revote.',
    candidats: [
      { description: 'Candidat yu jëkk : Amadou Koné' },
      { description: 'Candidat yu ñaar : Fatou Diallo' },
      { description: 'Candidat yu ñett : Moussa Sarr' },
      { description: 'Candidat yu ñeent : Ousmane Balde' },
      { description: 'Candidat yu juróom : Aissatou Ndiaye' },
      { description: 'Candidat yu juróom-benn : Mamadou Ba' },
      { description: 'Candidat yu juróom-ñaar : Rokhaya Sy' },
    ]
  },
  pu: {
    label: '🇸🇳 Pulaar', code: 'fr-FR',
    titre: 'Vote Presidente 2029',
    clotureTexte: 'Timata', candidatsTexte: '7 yimbe',
    confirmerBtn: 'Suɓo am candidat →',
    securiteMsg: '🔒 Vote maa chiffré ina dañaa.',
    accessibleMsg: '🔊 Hooltu 🔊 ngam heɓde innde candidat',
    confirmerTitre: 'Ɓeydu vote maa', confirmerSub: 'Ko waawaa artude',
    voterBtn: 'Vote jooni →', annulerBtn: 'Haɓɓu',
    selectionLabel: 'Suɓaande maa',
    voteOk: 'Vote maa enregistré!', voteSub: 'Vote maa chiffré o yolti',
    merci: '🌳 Jaraama! Senegaal 🇸🇳',
    doubleVote: '🚫 A vote haa. Waawaa vote tataɓe.',
    candidats: [
      { description: 'Candidat gooto : Amadou Koné' },
      { description: 'Candidat didi : Fatou Diallo' },
      { description: 'Candidat tati : Moussa Sarr' },
      { description: 'Candidat nayi : Ousmane Balde' },
      { description: 'Candidat jowi : Aissatou Ndiaye' },
      { description: 'Candidat jeegom : Mamadou Ba' },
      { description: 'Candidat jeedom-didi : Rokhaya Sy' },
    ]
  },
  di: {
    label: '🇸🇳 Diola', code: 'fr-FR',
    titre: 'Vote Président 2029',
    clotureTexte: 'Fini ci', candidatsTexte: '7 amani',
    confirmerBtn: 'Kilen candidat →',
    securiteMsg: '🔒 Vote bu chiffré.',
    accessibleMsg: '🔊 Bugul 🔊 ngir tegël tur',
    confirmerTitre: 'Kile vote', confirmerSub: 'Bëgg woon',
    voterBtn: 'Vote léegi →', annulerBtn: 'Wóoral',
    selectionLabel: 'Kilen',
    voteOk: 'Vote enregistré!', voteSub: 'Vote chiffré te yonnëënt',
    merci: '🌳 Merci! Senegaal 🇸🇳',
    doubleVote: '🚫 Vote ngeen déjà.',
    candidats: [
      { description: 'Candidat ku jëkk : Amadou Koné' },
      { description: 'Candidat ku ñaar : Fatou Diallo' },
      { description: 'Candidat ku ñett : Moussa Sarr' },
      { description: 'Candidat ku quatre : Ousmane Balde' },
      { description: 'Candidat ku cinq : Aissatou Ndiaye' },
      { description: 'Candidat ku six : Mamadou Ba' },
      { description: 'Candidat ku sept : Rokhaya Sy' },
    ]
  },
}

const candidats = [
  { id: 1, nom: 'Amadou Koné', parti: 'Parti du Renouveau Démocratique', couleur: '#185FA5',
    photo: 'https://ui-avatars.com/api/?name=Amadou+Kone&size=128&background=185FA5&color=ffffff&bold=true&rounded=true' },
  { id: 2, nom: 'Fatou Diallo', parti: 'Alliance pour le Progrès', couleur: '#00853F',
    photo: 'https://ui-avatars.com/api/?name=Fatou+Diallo&size=128&background=00853F&color=ffffff&bold=true&rounded=true' },
  { id: 3, nom: 'Moussa Sarr', parti: 'Front Citoyen Unifié', couleur: '#E31B23',
    photo: 'https://ui-avatars.com/api/?name=Moussa+Sarr&size=128&background=E31B23&color=ffffff&bold=true&rounded=true' },
  { id: 4, nom: 'Ousmane Balde', parti: 'Mouvement pour la Justice', couleur: '#5F5E5A',
    photo: 'https://ui-avatars.com/api/?name=Ousmane+Balde&size=128&background=5F5E5A&color=ffffff&bold=true&rounded=true' },
  { id: 5, nom: 'Aissatou Ndiaye', parti: 'Coalition Espoir Sénégal', couleur: '#D4537E',
    photo: 'https://ui-avatars.com/api/?name=Aissatou+Ndiaye&size=128&background=D4537E&color=ffffff&bold=true&rounded=true' },
  { id: 6, nom: 'Mamadou Ba', parti: 'Union Démocratique Nationale', couleur: '#3B6D11',
    photo: 'https://ui-avatars.com/api/?name=Mamadou+Ba&size=128&background=3B6D11&color=ffffff&bold=true&rounded=true' },
  { id: 7, nom: 'Rokhaya Sy', parti: 'Front Populaire Sénégalais', couleur: '#BA7517',
    photo: 'https://ui-avatars.com/api/?name=Rokhaya+Sy&size=128&background=BA7517&color=ffffff&bold=true&rounded=true' },
]

const lireTexte = (texte, code = 'fr-FR') => {
  if (!window.speechSynthesis) return
  window.speechSynthesis.cancel()
  const u = new SpeechSynthesisUtterance(texte)
  u.lang = code
  u.rate = 0.85
  window.speechSynthesis.speak(u)
}

function Vote() {
  const navigate = useNavigate()
  const [langue, setLangue] = useState('fr')
  const [selected, setSelected] = useState(null)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [voted, setVoted] = useState(false)
  const [recu, setRecu] = useState('')
  const [candidatVote, setCandidatVote] = useState(null)
  const [accessible, setAccessible] = useState(false)
  const [speaking, setSpeaking] = useState(null)

  const t = langues[langue]

  const handleLire = (e, index) => {
    e.stopPropagation()
    setSpeaking(index)
    lireTexte(t.candidats[index].description, t.code)
    setTimeout(() => setSpeaking(null), 3000)
  }

  const handleSelectCandidat = (candidat, index) => {
    if (voted) return
    setSelected(candidat.id)
    if (accessible) lireTexte(t.candidats[index].description, t.code)
  }

  const handleConfirm = async () => {
    setLoading(true)
    try {
      await new Promise(r => setTimeout(r, 1500))
      const hash = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
      setRecu(hash)
      setCandidatVote(candidats.find(c => c.id === selected))
      setVoted(true)
      setShowConfirm(false)
      lireTexte(t.voteOk, t.code)
    } finally {
      setLoading(false)
    }
  }

  const candidatSelectionne = candidats.find(c => c.id === selected)

  if (voted) {
    return (
      <div className="vote-page">
        <div className="vote-card">
          <div className="recu-icon">✓</div>
          <h1 className="vote-title">{t.voteOk}</h1>
          <p className="vote-sub">{t.voteSub}</p>
          {candidatVote && (
            <div className="candidat-item" style={{marginBottom:'1rem', cursor:'default'}}>
              <img src={candidatVote.photo} alt={candidatVote.nom}
                style={{width:48, height:48, borderRadius:'50%', objectFit:'cover', flexShrink:0}}/>
              <div className="candidat-info">
                <p className="candidat-nom">{candidatVote.nom}</p>
                <p className="candidat-parti">{candidatVote.parti}</p>
              </div>
              <span className="badge-success">✓</span>
            </div>
          )}
          <div className="recu-box">
            <p className="recu-label">Reçu</p>
            <div className="recu-row"><span>Élection</span><strong>Présidentielle 2029</strong></div>
            <div className="recu-row"><span>Horodatage</span><strong>{new Date().toLocaleString('fr-FR')}</strong></div>
            <div className="recu-row"><span>Statut</span><span className="badge-success">Validé ✓</span></div>
          </div>
          <p className="recu-label" style={{marginTop:'1rem'}}>Empreinte cryptographique</p>
          <div className="recu-hash">{recu}</div>
          <div className="double-vote-warning">{t.doubleVote}</div>
          <div className="info-box" style={{marginTop:'0.75rem'}}>{t.merci}</div>
          <button className="btn-primary" style={{marginTop:'1rem'}}
            onClick={() => navigate('/resultats')}>
            Voir les résultats en direct →
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="vote-page">
      {showConfirm && (
        <div className="overlay">
          <div className="confirm-box">
            <div className="confirm-icon">⚠</div>
            <h2 className="confirm-title">{t.confirmerTitre}</h2>
            <p className="confirm-sub">{t.confirmerSub}</p>
            <div className="confirm-candidat">
              <p className="recu-label">{t.selectionLabel}</p>
              <div className="candidat-mini">
                <img src={candidatSelectionne?.photo} alt={candidatSelectionne?.nom}
                  style={{width:36, height:36, borderRadius:'50%', objectFit:'cover', flexShrink:0}}/>
                <div>
                  <p className="candidat-nom">{candidatSelectionne?.nom}</p>
                  <p className="candidat-parti">{candidatSelectionne?.parti}</p>
                </div>
              </div>
            </div>
            <div className="confirm-chiffrement">
              <span>Chiffrement</span>
              <span className="badge-success">RSA-2048 ✓</span>
            </div>
            <button className="btn-primary" onClick={handleConfirm} disabled={loading}>
              {loading && <span className="spinner" />}
              {loading ? '...' : t.voterBtn}
            </button>
            <button className="btn-ghost" onClick={() => setShowConfirm(false)}>{t.annulerBtn}</button>
          </div>
        </div>
      )}

      <div className="vote-card">
        <div className="vote-nav">
          <div className="vote-nav-logo">
            <div className="nav-dot"></div>
            VoteSecure SN
          </div>
          <div className="vote-nav-right">
            <span className="badge-open">Scrutin ouvert</span>
            <button className={`btn-accessible ${accessible ? 'on' : ''}`}
              onClick={() => setAccessible(!accessible)}>🔊</button>
          </div>
        </div>

        <div className="langue-bar">
          {Object.entries(langues).map(([key, val]) => (
            <button key={key}
              className={`btn-langue ${langue === key ? 'active' : ''}`}
              onClick={() => { setLangue(key); lireTexte(val.titre, val.code) }}>
              {val.label}
            </button>
          ))}
        </div>

        {accessible && <div className="accessible-banner">{t.accessibleMsg}</div>}

        <h1 className="vote-election">{t.titre}</h1>
        <p className="vote-election-sub">
          {t.clotureTexte} <strong style={{color:'#E31B23'}}>14h 22min</strong> · {t.candidatsTexte}
        </p>

        <div className="candidats-list">
          {candidats.map((c, index) => (
            <div key={c.id}
              className={`candidat-item ${selected === c.id ? 'selected' : ''} ${accessible ? 'accessible' : ''}`}
              onClick={() => handleSelectCandidat(c, index)}>
              <div className="candidat-numero">{index + 1}</div>
              <img src={c.photo} alt={c.nom}
                style={{width:44, height:44, borderRadius:'50%', objectFit:'cover', flexShrink:0}}/>
              <div className="candidat-info">
                <p className="candidat-nom">{c.nom}</p>
                <p className="candidat-parti">{c.parti}</p>
              </div>
              <button className={`btn-audio ${speaking === index ? 'speaking' : ''}`}
                onClick={(e) => handleLire(e, index)}>
                {speaking === index ? '🔈' : '🔊'}
              </button>
              <div className={`radio ${selected === c.id ? 'on' : ''}`}>
                {selected === c.id && <div className="radio-inner" />}
              </div>
            </div>
          ))}
        </div>

        <div className="info-box">{t.securiteMsg}</div>

        <button className="btn-primary" disabled={!selected}
          onClick={() => setShowConfirm(true)}>
          {t.confirmerBtn}
        </button>
      </div>
    </div>
  )
}

export default Vote