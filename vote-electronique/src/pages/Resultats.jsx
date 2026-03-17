import { useState, useEffect } from 'react'
import '../styles/Resultats.css'

const candidatsInit = [
  { id: 1, nom: 'Amadou Koné', parti: 'Parti du Renouveau Démocratique', votes: 4230, couleur: '#185FA5',
    photo: 'https://ui-avatars.com/api/?name=Amadou+Kone&size=128&background=185FA5&color=ffffff&bold=true&rounded=true' },
  { id: 2, nom: 'Fatou Diallo', parti: 'Alliance pour le Progrès', votes: 3810, couleur: '#00853F',
    photo: 'https://ui-avatars.com/api/?name=Fatou+Diallo&size=128&background=00853F&color=ffffff&bold=true&rounded=true' },
  { id: 3, nom: 'Moussa Sarr', parti: 'Front Citoyen Unifié', votes: 2100, couleur: '#E31B23',
    photo: 'https://ui-avatars.com/api/?name=Moussa+Sarr&size=128&background=E31B23&color=ffffff&bold=true&rounded=true' },
  { id: 4, nom: 'Ousmane Balde', parti: 'Mouvement pour la Justice', votes: 1540, couleur: '#5F5E5A',
    photo: 'https://ui-avatars.com/api/?name=Ousmane+Balde&size=128&background=5F5E5A&color=ffffff&bold=true&rounded=true' },
  { id: 5, nom: 'Aissatou Ndiaye', parti: 'Coalition Espoir Sénégal', votes: 980, couleur: '#D4537E',
    photo: 'https://ui-avatars.com/api/?name=Aissatou+Ndiaye&size=128&background=D4537E&color=ffffff&bold=true&rounded=true' },
  { id: 6, nom: 'Mamadou Ba', parti: 'Union Démocratique Nationale', votes: 760, couleur: '#3B6D11',
    photo: 'https://ui-avatars.com/api/?name=Mamadou+Ba&size=128&background=3B6D11&color=ffffff&bold=true&rounded=true' },
  { id: 7, nom: 'Rokhaya Sy', parti: 'Front Populaire Sénégalais', votes: 580, couleur: '#BA7517',
    photo: 'https://ui-avatars.com/api/?name=Rokhaya+Sy&size=128&background=BA7517&color=ffffff&bold=true&rounded=true' },
]

function Resultats() {
  const [candidats, setCandidats] = useState(candidatsInit)
  const [lastUpdate, setLastUpdate] = useState(new Date())
  const [participation, setParticipation] = useState(61)

  const total = candidats.reduce((sum, c) => sum + c.votes, 0)
  const leader = [...candidats].sort((a, b) => b.votes - a.votes)[0]

  // Simulation mise à jour en temps réel
  useEffect(() => {
    const interval = setInterval(() => {
      setCandidats(prev => prev.map(c => ({
        ...c,
        votes: c.votes + Math.floor(Math.random() * 50)
      })))
      setLastUpdate(new Date())
      setParticipation(prev => Math.min(prev + 0.1, 85))
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="res-page">

      {/* Bandeau drapeau */}
      <div className="drapeau-bar">
        <div className="drapeau-vert" />
        <div className="drapeau-jaune"><span className="etoile">★</span></div>
        <div className="drapeau-rouge" />
      </div>

      <div className="res-container">

        {/* Header */}
        <div className="res-header">
          <div className="res-header-left">
            <h1 className="res-titre">Élection Présidentielle 2029</h1>
            <p className="res-sub">
              Résultats provisoires — mise à jour toutes les 30 secondes
            </p>
          </div>
          <div className="res-live">
            <div className="live-dot" />
            En direct
          </div>
        </div>

        {/* Stats globales */}
        <div className="res-stats">
          <div className="stat-card">
            <p className="stat-value">{total.toLocaleString('fr-FR')}</p>
            <p className="stat-label">Votes reçus</p>
          </div>
          <div className="stat-card">
            <p className="stat-value" style={{color:'#00853F'}}>{participation.toFixed(1)}%</p>
            <p className="stat-label">Participation</p>
          </div>
          <div className="stat-card">
            <p className="stat-value" style={{color:'#E31B23'}}>14h</p>
            <p className="stat-label">Temps restant</p>
          </div>
          <div className="stat-card">
            <p className="stat-value">7</p>
            <p className="stat-label">Candidats</p>
          </div>
        </div>

        {/* Leader */}
        <div className="res-leader">
          <div className="leader-badge">🏆 En tête</div>
          <div className="leader-info">
            <img src={leader.photo} alt={leader.nom}
              style={{width:56, height:56, borderRadius:'50%', objectFit:'cover'}}/>
            <div>
              <p className="leader-nom">{leader.nom}</p>
              <p className="leader-parti">{leader.parti}</p>
            </div>
            <div className="leader-pct">
              {((leader.votes / total) * 100).toFixed(1)}%
            </div>
          </div>
        </div>

        {/* Barres résultats */}
        <div className="res-liste">
          {[...candidats]
            .sort((a, b) => b.votes - a.votes)
            .map((c, index) => {
              const pct = ((c.votes / total) * 100).toFixed(1)
              return (
                <div key={c.id} className="res-item">
                  <div className="res-rank">#{index + 1}</div>
                  <img src={c.photo} alt={c.nom}
                    style={{width:40, height:40, borderRadius:'50%', objectFit:'cover', flexShrink:0}}/>
                  <div className="res-info">
                    <div className="res-info-top">
                      <span className="res-nom">{c.nom}</span>
                      <span className="res-pct" style={{color: c.couleur}}>{pct}%</span>
                    </div>
                    <p className="res-parti">{c.parti}</p>
                    <div className="res-bar-wrap">
                      <div className="res-bar"
                        style={{width: `${pct}%`, background: c.couleur}}/>
                    </div>
                    <p className="res-votes">{c.votes.toLocaleString('fr-FR')} votes</p>
                  </div>
                </div>
              )
            })}
        </div>

        {/* Dernière mise à jour */}
        <div className="res-footer">
          <p>Dernière mise à jour : {lastUpdate.toLocaleTimeString('fr-FR')}</p>
          <p>🔒 Résultats chiffrés et vérifiés — VoteSecure SN 🇸🇳</p>
        </div>

      </div>
    </div>
  )
}

export default Resultats