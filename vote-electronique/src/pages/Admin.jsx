import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/Admin.css'

const electeursInit = [
  { id: 1, nom: 'Amadou Diallo', cnie: '1234567890123', telephone: '+221771234567', aVote: true, region: 'Dakar' },
  { id: 2, nom: 'Fatou Sow', cnie: '9876543210987', telephone: '+221772345678', aVote: false, region: 'Thiès' },
  { id: 3, nom: 'Moussa Ndiaye', cnie: '1122334455667', telephone: '+221773456789', aVote: false, region: 'Saint-Louis' },
  { id: 4, nom: 'Aissatou Ba', cnie: '7788990011223', telephone: '+221774567890', aVote: true, region: 'Ziguinchor' },
  { id: 5, nom: 'Omar Sy', cnie: '5544332211009', telephone: '+221775678901', aVote: false, region: 'Kaolack' },
]

const electionInit = {
  titre: 'Élection Présidentielle 2029',
  dateDebut: '2029-02-25',
  dateFin: '2029-02-25',
  statut: 'ouverte',
  totalElecteurs: 7200000,
}

function Admin() {
  const navigate = useNavigate()
  const adminSession = sessionStorage.getItem('adminSession')
  const admin = adminSession ? JSON.parse(adminSession) : null

  useEffect(() => {
    if (!adminSession) navigate('/admin-login')
  }, [])

  const [page, setPage] = useState('dashboard')
  const [election, setElection] = useState(electionInit)
  const [electeurs, setElecteurs] = useState(electeursInit)
  const [alertes] = useState([
    { id: 1, type: 'danger', msg: 'Tentative double vote — CNIE #7823', heure: '09:51' },
    { id: 2, type: 'info', msg: '1 248 votes reçus dernière minute', heure: '09:50' },
    { id: 3, type: 'success', msg: 'Système de chiffrement opérationnel', heure: '09:47' },
  ])
  const [showAjout, setShowAjout] = useState(false)
  const [newElecteur, setNewElecteur] = useState({ nom: '', cnie: '', telephone: '', region: '' })

  if (!admin) return null

  const totalVotes = electeurs.filter(e => e.aVote).length
  const participation = ((totalVotes / electeurs.length) * 100).toFixed(1)

  const handleAjouterElecteur = () => {
    if (!newElecteur.nom || !newElecteur.cnie) return
    setElecteurs(prev => [...prev, { id: prev.length + 1, ...newElecteur, aVote: false }])
    setNewElecteur({ nom: '', cnie: '', telephone: '', region: '' })
    setShowAjout(false)
  }

  const handleStatutElection = () => {
    setElection(prev => ({
      ...prev,
      statut: prev.statut === 'ouverte' ? 'cloturee' : 'ouverte'
    }))
  }

  const handleDeconnexion = () => {
    sessionStorage.removeItem('adminSession')
    navigate('/admin-login')
  }

  return (
    <div className="admin-page">
      <div className="admin-sidebar">
        <div className="admin-logo">
          <div className="admin-logo-icon">VS</div>
          <div>
            <p className="admin-logo-text">VoteSecure</p>
            <p className="admin-logo-sub">Administration</p>
          </div>
        </div>

        <nav className="admin-nav">
          {[
            { key: 'dashboard', icon: '📊', label: 'Tableau de bord' },
            { key: 'election', icon: '🗳️', label: 'Élection' },
            { key: 'electeurs', icon: '👥', label: 'Électeurs' },
            { key: 'audit', icon: '📋', label: 'Audit' },
          ].map(item => (
            <button key={item.key}
              className={`admin-nav-item ${page === item.key ? 'active' : ''}`}
              onClick={() => setPage(item.key)}>
              <span>{item.icon}</span>{item.label}
            </button>
          ))}
        </nav>

        <div className="admin-user">
          <div className="admin-avatar">
            {admin.nom.split(' ').map(n => n[0]).join('').slice(0,2)}
          </div>
          <div>
            <p className="admin-user-nom">{admin.nom}</p>
            <p className="admin-user-role">{admin.role}</p>
          </div>
        </div>

        <button onClick={handleDeconnexion} style={{
          width:'100%', padding:'8px', marginTop:'8px',
          background:'transparent', border:'1px solid #DDDDDA',
          borderRadius:'6px', fontSize:'12px', color:'#E31B23',
          cursor:'pointer', fontFamily:'inherit'
        }}>
          🚪 Se déconnecter
        </button>
      </div>

      <div className="admin-main">

        {page === 'dashboard' && (
          <div>
            <div className="admin-header">
              <h1 className="admin-titre">Tableau de bord</h1>
              <div className={`admin-statut ${election.statut}`}>
                {election.statut === 'ouverte' ? '🟢 Scrutin ouvert' : '🔴 Scrutin clôturé'}
              </div>
            </div>
            <div className="admin-stats">
              <div className="admin-stat-card">
                <p className="admin-stat-value">{totalVotes.toLocaleString()}</p>
                <p className="admin-stat-label">Votes reçus</p>
              </div>
              <div className="admin-stat-card">
                <p className="admin-stat-value" style={{color:'#00853F'}}>{participation}%</p>
                <p className="admin-stat-label">Participation</p>
              </div>
              <div className="admin-stat-card">
                <p className="admin-stat-value">{electeurs.length}</p>
                <p className="admin-stat-label">Électeurs inscrits</p>
              </div>
              <div className="admin-stat-card">
                <p className="admin-stat-value" style={{color:'#E31B23'}}>{alertes.filter(a => a.type === 'danger').length}</p>
                <p className="admin-stat-label">Alertes sécurité</p>
              </div>
            </div>
            <div className="admin-card">
              <h2 className="admin-card-titre">Journal d'audit — Dernières actions</h2>
              {alertes.map(a => (
                <div key={a.id} className={`alerte-item ${a.type}`}>
                  <span className="alerte-tag">{a.type === 'danger' ? '🚨 ALERTE' : a.type === 'info' ? 'ℹ️ INFO' : '✅ OK'}</span>
                  <span className="alerte-msg">{a.msg}</span>
                  <span className="alerte-heure">{a.heure}</span>
                </div>
              ))}
            </div>
            <div className="admin-card">
              <h2 className="admin-card-titre">Actions rapides</h2>
              <div className="admin-actions">
                <button className="btn-admin-primary" onClick={() => setPage('election')}>🗳️ Gérer l'élection</button>
                <button className="btn-admin-primary" onClick={() => setPage('electeurs')}>👥 Gérer les électeurs</button>
                <button className="btn-admin-secondary" onClick={() => navigate('/resultats')}>📊 Voir les résultats</button>
              </div>
            </div>
          </div>
        )}

        {page === 'election' && (
          <div>
            <div className="admin-header">
              <h1 className="admin-titre">Gestion de l'élection</h1>
            </div>
            <div className="admin-card">
              <h2 className="admin-card-titre">Élection en cours</h2>
              <div className="election-info">
                <div className="election-row"><span>Titre</span><strong>{election.titre}</strong></div>
                <div className="election-row"><span>Date début</span><strong>{election.dateDebut}</strong></div>
                <div className="election-row"><span>Date fin</span><strong>{election.dateFin}</strong></div>
                <div className="election-row">
                  <span>Statut</span>
                  <span className={`badge-statut ${election.statut}`}>
                    {election.statut === 'ouverte' ? '🟢 Ouverte' : '🔴 Clôturée'}
                  </span>
                </div>
                <div className="election-row"><span>Total électeurs</span><strong>{election.totalElecteurs.toLocaleString()}</strong></div>
              </div>
              <div style={{marginTop:'1.5rem', display:'flex', gap:'10px'}}>
                <button
                  className={election.statut === 'ouverte' ? 'btn-admin-danger' : 'btn-admin-primary'}
                  onClick={handleStatutElection}>
                  {election.statut === 'ouverte' ? '🔴 Clôturer le scrutin' : '🟢 Rouvrir le scrutin'}
                </button>
                <button className="btn-admin-secondary" onClick={() => navigate('/resultats')}>📊 Voir les résultats</button>
              </div>
            </div>
          </div>
        )}

        {page === 'electeurs' && (
          <div>
            <div className="admin-header">
              <h1 className="admin-titre">Gestion des électeurs</h1>
              <button className="btn-admin-primary" onClick={() => setShowAjout(!showAjout)}>+ Ajouter un électeur</button>
            </div>
            {showAjout && (
              <div className="admin-card" style={{marginBottom:'1rem'}}>
                <h2 className="admin-card-titre">Nouvel électeur</h2>
                <div className="form-grid">
                  <div className="admin-field">
                    <label>Nom complet</label>
                    <input type="text" placeholder="Amadou Diallo"
                      value={newElecteur.nom}
                      onChange={e => setNewElecteur(p => ({...p, nom: e.target.value}))}/>
                  </div>
                  <div className="admin-field">
                    <label>Numéro CNIE</label>
                    <input type="text" placeholder="1234567890123"
                      value={newElecteur.cnie}
                      onChange={e => setNewElecteur(p => ({...p, cnie: e.target.value}))}/>
                  </div>
                  <div className="admin-field">
                    <label>Téléphone</label>
                    <input type="text" placeholder="+221771234567"
                      value={newElecteur.telephone}
                      onChange={e => setNewElecteur(p => ({...p, telephone: e.target.value}))}/>
                  </div>
                  <div className="admin-field">
                    <label>Région</label>
                    <select value={newElecteur.region}
                      onChange={e => setNewElecteur(p => ({...p, region: e.target.value}))}>
                      <option value="">Choisir...</option>
                      {['Dakar','Thiès','Saint-Louis','Ziguinchor','Kaolack','Tambacounda','Kolda','Fatick','Louga','Matam','Diourbel','Kaffrine','Kédougou','Sédhiou'].map(r => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div style={{display:'flex', gap:'10px', marginTop:'1rem'}}>
                  <button className="btn-admin-primary" onClick={handleAjouterElecteur}>✅ Enregistrer</button>
                  <button className="btn-admin-secondary" onClick={() => setShowAjout(false)}>Annuler</button>
                </div>
              </div>
            )}
            <div className="admin-card">
              <div className="electeurs-stats">
                <span>Total : <strong>{electeurs.length}</strong></span>
                <span>Ont voté : <strong style={{color:'#00853F'}}>{electeurs.filter(e=>e.aVote).length}</strong></span>
                <span>N'ont pas voté : <strong style={{color:'#E31B23'}}>{electeurs.filter(e=>!e.aVote).length}</strong></span>
              </div>
              <div className="electeurs-table">
                <div className="table-head">
                  <span>Nom</span><span>CNIE</span><span>Région</span><span>Statut</span>
                </div>
                {electeurs.map(e => (
                  <div key={e.id} className="table-row">
                    <span className="table-nom">{e.nom}</span>
                    <span className="table-cnie">{e.cnie}</span>
                    <span>{e.region}</span>
                    <span className={`badge-vote ${e.aVote ? 'oui' : 'non'}`}>
                      {e.aVote ? '✓ A voté' : '⏳ En attente'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {page === 'audit' && (
          <div>
            <div className="admin-header">
              <h1 className="admin-titre">Journal d'audit</h1>
              <button className="btn-admin-secondary">⬇️ Exporter PDF</button>
            </div>
            <div className="admin-card">
              <p style={{fontSize:'13px', color:'var(--text-light)', marginBottom:'1rem'}}>
                Toutes les actions sont enregistrées et horodatées pour garantir la transparence.
              </p>
              {[
                { action: 'VOTE', detail: 'Électeur ID #1 a voté', heure: '10:47:23', type: 'success' },
                { action: 'ALERTE', detail: 'Tentative double vote CNIE #7823', heure: '09:51:14', type: 'danger' },
                { action: 'VOTE', detail: '1248 votes reçus (dernière minute)', heure: '09:50:00', type: 'success' },
                { action: 'CONNEXION', detail: `Admin ${admin.username} connecté`, heure: '09:47:32', type: 'info' },
                { action: 'SYSTÈME', detail: 'Chiffrement RSA-2048 activé', heure: '08:00:00', type: 'info' },
                { action: 'ÉLECTION', detail: 'Scrutin ouvert par admin', heure: '07:00:00', type: 'success' },
              ].map((log, i) => (
                <div key={i} className={`audit-row ${log.type}`}>
                  <span className={`audit-tag ${log.type}`}>{log.action}</span>
                  <span className="audit-detail">{log.detail}</span>
                  <span className="audit-heure">{log.heure}</span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

export default Admin