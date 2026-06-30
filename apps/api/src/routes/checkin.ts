import { Router } from 'express'

const router = Router()

router.post('/', (_req, res) => {
  res.json({ message: 'Submit check-in — coming soon' })
})

router.get('/history', (_req, res) => {
  res.json({ message: 'Check-in history — coming soon' })
})

export default router
