import { Router } from 'express'

const router = Router()

router.post('/send-otp', (_req, res) => {
  res.json({ message: 'Twilio OTP — coming soon' })
})

router.post('/verify-otp', (_req, res) => {
  res.json({ message: 'Twilio verify — coming soon' })
})

export default router
