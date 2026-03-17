const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const JWT_SECRET = 'votesecure_senegal_2029_secret_key'

const electeurs = [
  {
    id: 1,
    cnie: '1234567890123',
    nom: 'Amadou Diallo',
    telephone: '+221771234567',
    password: '$2b$10$ykdFsa7viBHlPcBHcCUZyOmdNXNCxncpO6Au.MkcVfI2sUo6TtI.S',
    aVote: false
  }
]

const otpStore = {}

router.post('/login', async (req, res) => {
  try {
    const { cnie, password } = req.body
    const electeur = electeurs.find(e => e.cnie === cnie.replace(/\s/g, ''))
    if (!electeur) {
      return res.status(401).json({ message: 'CNIE ou mot de passe incorrect' })
    }
    const valid = await bcrypt.compare(password, electeur.password)
    if (!valid) {
      return res.status(401).json({ message: 'CNIE ou mot de passe incorrect' })
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    otpStore[electeur.id] = {
      code: otp,
      expiry: Date.now() + 5 * 60 * 1000
    }
    console.log(`📱 OTP pour ${electeur.nom}: ${otp}`)
    res.json({
      success: true,
      electeurId: electeur.id,
      maskedPhone: electeur.telephone.replace(/(\+221\d{2})\d{3}(\d{2})/, '$1***$2'),
      otpDebug: otp
    })
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' })
  }
})

router.post('/verify-otp', (req, res) => {
  try {
    const { electeurId, otp } = req.body
    const id = parseInt(electeurId)
    const stored = otpStore[id]
    if (!stored) {
      return res.status(401).json({ message: 'Code OTP introuvable' })
    }
    if (Date.now() > stored.expiry) {
      delete otpStore[id]
      return res.status(401).json({ message: 'Code OTP expiré' })
    }
    if (stored.code !== otp) {
      return res.status(401).json({ message: 'Code OTP incorrect' })
    }
    delete otpStore[id]
    const electeur = electeurs.find(e => e.id === id)
    const token = jwt.sign(
      { id: electeur.id, nom: electeur.nom, cnie: electeur.cnie },
      JWT_SECRET,
      { expiresIn: '24h' }
    )
    res.json({
      success: true,
      token,
      electeur: { nom: electeur.nom, aVote: electeur.aVote }
    })
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' })
  }
})

module.exports = router