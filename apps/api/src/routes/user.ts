import { Router } from 'express'

const router = Router()

router.get('/profile', (_req, res) => {
  res.json({ message: 'Get user profile — coming soon' })
})

router.post('/profile', (_req, res) => {
  res.json({ message: 'Save user profile — coming soon' })
})

export default router
