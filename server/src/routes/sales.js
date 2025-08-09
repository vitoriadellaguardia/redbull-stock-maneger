const express = require('express')
const { PrismaClient } = require('@prisma/client')

const router = express.Router()
const prisma = new PrismaClient()

// GET /api/sales
router.get('/', async (req, res) => {
  try {
    const sales = await prisma.sale.findMany({
      include: {
        product: { select: { name: true } }
      },
      orderBy: { date: 'desc' }
    })
    
    const salesWithProductName = sales.map(sale => ({
      ...sale,
      productName: sale.product.name
    }))
    
    res.json(salesWithProductName)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// POST /api/sales
router.post('/', async (req, res) => {
  try {
    const { productId, quantity, customerName } = req.body
    
    // Buscar produto para calcular preço total e verificar estoque
    const product = await prisma.product.findUnique({
      where: { id: productId }
    })
    
    if (!product) {
      return res.status(404).json({ error: 'Produto não encontrado' })
    }
    
    if (product.stock < quantity) {
      return res.status(400).json({ error: 'Estoque insuficiente' })
    }
    
    const totalPrice = product.price * quantity
    
    // Criar venda e atualizar estoque em uma transação
    const result = await prisma.$transaction([
      prisma.sale.create({
        data: {
          productId,
          quantity,
          totalPrice,
          customerName
        }
      }),
      prisma.product.update({
        where: { id: productId },
        data: { stock: { decrement: quantity } }
      }),
      prisma.stockMovement.create({
        data: {
          productId,
          type: 'saida',
          quantity,
          reason: 'Venda'
        }
      })
    ])
    
    res.status(201).json(result[0])
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

module.exports = router