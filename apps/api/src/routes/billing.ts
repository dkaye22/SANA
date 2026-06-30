import { Router } from 'express'

const router = Router()

router.get('/status', (_req, res) => {
  res.json({ message: 'Subscription status — coming soon' })
})

router.post('/webhook', (_req, res) => {
  res.json({ message: 'Stripe webhook — coming soon' })
})

export default router
