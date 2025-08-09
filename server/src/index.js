const express = require('express')
const cors = require('cors')
const { PrismaClient } = require('@prisma/client')

const productsRouter = require('./routes/products')
const salesRouter = require('./routes/sales')
const stockRouter = require('./routes/stock')
const dashboardRouter = require('./routes/dashboard')

const app = express()
const prisma = new PrismaClient()

app.use(cors())
app.use(express.json())

// Routes
app.use('/api/products', productsRouter)
app.use('/api/sales', salesRouter)
app.use('/api/stock', stockRouter)
app.use('/api/dashboard', dashboardRouter)

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Red Bull Stock API is running' })
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
})

// Graceful shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect()
})