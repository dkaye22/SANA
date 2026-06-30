import express from 'express'
import cors from 'cors'
import authRoutes from './routes/auth'
import userRoutes from './routes/user'
import checkinRoutes from './routes/checkin'
import planRoutes from './routes/plan'
import billingRoutes from './routes/billing'

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors({ origin: 'http://localhost:5173' }))
app.use(express.json())

app.get('/health', (_req, res) => res.json({ status: 'ok' }))

app.use('/api/auth', authRoutes)
app.use('/api/user', userRoutes)
app.use('/api/checkin', checkinRoutes)
app.use('/api/plan', planRoutes)
app.use('/api/billing', billingRoutes)

app.listen(PORT, () => {
  console.log(`Sana API running at http://localhost:${PORT}`)
})
