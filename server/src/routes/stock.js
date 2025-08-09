const express = require('express')
const { PrismaClient } = require('@prisma/client')

const router = express.Router()
const prisma = new PrismaClient()

// GET /api/stock/movements
router.get('/movements', async (req, res) => {
  try {
    const movements = await prisma.stockMovement.findMany({
      include: {
        product: { select: { name: true } }
      },
      orderBy: { date: 'desc' }
    })
    
    const movementsWithProductName = movements.map(movement => ({
      ...movement,
      productName: movement.product.name
    }))
    
    res.json(movementsWithProductName)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// POST /api/stock/movements
router.post('/movements', async (req, res) => {
  try {
    const { productId, type, quantity, reason } = req.body
    
    // Verificar se o produto existe
    const product = await prisma.product.findUnique({
      where: { id: productId }
    })
    
    if (!product) {
      return res.status(404).json({ error: 'Produto não encontrado' })
    }
    
    // Verificar se há estoque suficiente para saída
    if (type === 'saida' && product.stock < quantity) {
      return res.status(400).json({ error: 'Estoque insuficiente' })
    }
    
    // Criar movimentação e atualizar estoque
    const result = await prisma.$transaction([
      prisma.stockMovement.create({
        data: { productId, type, quantity, reason }
      }),
      prisma.product.update({
        where: { id: productId },
        data: {
          stock: type === 'entrada' 
            ? { increment: quantity }
            : { decrement: quantity }
        }
      })
    ])
    
    res.status(201).json(result[0])
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

module.exports = router