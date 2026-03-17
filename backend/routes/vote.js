const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')

// Simulation base de données
const electeurs = [
  {
    id: 1,
    cnie: '1234567890123',
    nom: 'Amadou Diallo',
    aVote: false
  }
]

const votes = []

const candidats = [
  { id: 1, nom: 'Amadou Koné', parti: 'Parti du Renouveau Démocratique', votes: 0 },
  { id: 2, nom: 'Fatou Diallo', parti: 'Alliance pour le Progrès', votes: 0 },
  { id: 3, nom: 'Moussa Sarr', parti: 'Front Citoyen Unifié', votes: 0 },
]

// Middleware vérification JWT
const verifierToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) return res.status(401).json({ message: 'Token manquant' })
  try {
    req.electeur = jwt.verify(token, process.env.JWT_SECRET)
    next()
  } catch {
    res.status(401).json({ message: 'Token invalide ou expiré' })
  }
}

// POST /api/vote — Soumettre un vote
router.post('/', verifierToken, (req, res) => {
  try {
    const { candidatId } = req.body
    const electeur = electeurs.find(e => e.id === req.electeur.id)

    // Vérifier si déjà voté
    if (!electeur) {
      return res.status(404).json({ message: 'Électeur introuvable' })
    }

    if (electeur.aVote) {
      return res.status(403).json({
        message: 'Vous avez déjà voté. Il est impossible de voter une deuxième fois.'
      })
    }

    // Vérifier candidat valide
    const candidat = candidats.find(c => c.id === candidatId)
    if (!candidat) {
      return res.status(400).json({ message: 'Candidat invalide' })
    }

    // Enregistrer le vote
    const hash = Math.random().toString(36).substring(2, 15) +
                 Math.random().toString(36).substring(2, 15)

    votes.push({
      electeurId: electeur.id,
      candidatId: candidat.id,
      hash,
      timestamp: new Date().toISOString()
    })

    // Marquer électeur comme ayant voté
    electeur.aVote = true
    candidat.votes++

    console.log(`✅ Vote enregistré — Électeur: ${electeur.nom} — Hash: ${hash}`)

    res.json({
      success: true,
      hash,
      message: 'Vote enregistré avec succès',
      timestamp: new Date().toISOString()
    })

  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' })
  }
})

// GET /api/vote/resultats — Voir les résultats
router.get('/resultats', (req, res) => {
  const total = votes.length
  const resultats = candidats.map(c => ({
    id: c.id,
    nom: c.nom,
    parti: c.parti,
    votes: c.votes,
    pourcentage: total > 0 ? ((c.votes / total) * 100).toFixed(1) : '0.0'
  }))

  res.json({
    total,
    resultats,
    timestamp: new Date().toISOString()
  })
})

module.exports = router